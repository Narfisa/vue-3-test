import hash from 'object-hash'
import moment from 'moment'

import queries from './queries'

async function wait (msec) { return new Promise((resolve) => setTimeout(resolve, msec)) }

// модуль апи: подтягивает запросы, контролирует очередь
class api {
    rootVm = null
    apiHost = ''
    fetchCache = {}
    actionModules = { queries }

    constructor () {
        this.apiHost = 'https://dog.ceo/api'

        setInterval(this.checkCache.bind(this), 10000)
    }

    checkCache () {
        const requestHashListToDelete = []
        for (const requestHash in this.fetchCache) {
            const cached = this.fetchCache[requestHash]
            const cachedUntil = moment(parseInt((cached.requestTime + cached.cacheLiveTime) * 1000))
            if (cachedUntil.diff(moment(), 'seconds') < 0) requestHashListToDelete.push(requestHash)
        }
        requestHashListToDelete.map(requestHash => delete this.fetchCache[requestHash])
    }

    setRoot (value) { this.rootVm = value; return this }

    query (path, ...apiParams) {
        return new Query(this, path, ...apiParams)
    }

    request (path, ...apiParams) {
        return this.query(path, ...apiParams).request()
    }
}


// модуль выполнения запроса: подготавливает гет/пост параметры, выполняет запрос и обрабатывает ответ
class FetchRequest {
    _vm = ''
    _url = ''
    _method = 'GET'
    _headers = {}
    __getparams = {}
    __postparams = {}
    _abortController = null
    _isAuth = true
    __rawResponse = false
    __rawResponseError = false
    __responseErrorType = false // cors / offline (lost internet connection) / server_error
    __tryCountLimit = 3
    static __isAlreadyAuthed = false

    __isFile = false
    __requestParamsOnRequest = null

    setVm (value) { this._vm = value; return this }
    setUrl (value) { this._url = value; return this }
    setMethod (value) { this._method = value; return this }
    setHeaders (value) { this._headers = value; return this }
    setGetparams (value) { this.__getparams = value; return this }
    setPostparams (value) { this.__postparams = value; return this }
    setIsAuth (value) { this._isAuth = value; return this }
    setAbortController (value) { this._abortController = value; return this }

    get _getparams () {
        return { ...this.__getparams }
    }

    get _postparams () { return this.__postparams }
    requestBuildQuery (obj, prefix) {
        if (obj === null || typeof obj !== 'object') return ''
        const str = []
        for (const p in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, p)) {
                const k = prefix ? prefix + '[' + p + ']' : p
                const v = obj[p]
                str.push(
                    v !== null && typeof v === 'object'
                        ? this.requestBuildQuery(v, k)
                        : encodeURIComponent(k) +
                        '=' +
                        encodeURIComponent(v !== null ? v : '')
                )
            }
        }
        return str.join('&')
    }

    requestBuildFormData (data) {
        const formDataInstance = new FormData()
        for (const key in data) {
            formDataInstance.append(key, data[key])
        }
        return formDataInstance
    }

    get requestUrl () {
        let outUrl = this._url
        if (Object.keys(this._getparams).length > 0) outUrl += '?' + this.requestBuildQuery(this._getparams)
        return outUrl
    }

    get requestOptions () {
        const outOptions = {
            credentials: 'omit', // https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
            method: this._method,
            mode: 'cors',
            // cache: 'default', // https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
            headers: { ...this._headers },
            signal: this._abortController.signal,
            body: null
        }

        if (['POST', 'PUT'].includes(this._method) && Object.keys(this._postparams).length > 0) {
            if ('Content-Type' in outOptions.headers && outOptions.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                outOptions.body = this.requestBuildQuery(this._postparams)
            } else {
                outOptions.body = this.requestBuildFormData(this._postparams)
            }
        }

        return outOptions
    }

    get requestHash () { return hash({ url: this._url, options: { headers: this._headers, get: this._getparams, post: this._postparams } }) }

    get isCurrentParamsAsRequestParams () { return this.__requestParamsOnRequest === this.requestHash } // текущие параметры фильтров не совпадают с параметрами, при которых был сделан запрос
    _loadedData = false
    _isFailedToReadData = false
    async request () {
        this.__tryCountLimit--
        let r
        try {
            this.__requestParamsOnRequest = this.requestHash
            r = await fetch(this.requestUrl, this.requestOptions)
            this.__rawResponse = r
        } catch (e) {
            this.__rawResponseError = e
            if (this.__rawResponseError.name === 'AbortError' || this.__rawResponseError.code === 20) {
                this.__responseErrorType = 'aborted'
            } else {
                // проверка ошибка cors или проблемы с сетью
                try {
                    const checkR = await fetch('/version.json')
                    if (checkR.status === 200) {
                        this.__responseErrorType = 'cors'
                    } else {
                        this.__responseErrorType = 'server_error'
                    }
                } catch (e) {
                    this.__responseErrorType = 'offline'
                }
            }
        }

        if (!this.__rawResponseError) {
            try {
                this.__isFile = !!r.headers.get('filename')
                this._loadedData = (!r)
                    ? false
                    : (r.status === 204)
                        ? true
                        : (!this.__isFile)
                            ? await r.json()
                            : await r.blob() //  || !r.bodyUsed
            } catch (e) {
                this._isFailedToReadData = true
            }
        }

        if (this._isFailedToReadData) {
            if (this.__tryCountLimit < 1) {
                return this
            } else {
                console.debug('trying to reload data')
                this._isFailedToReadData = false
                await wait(500)
                return this.request()
            }
        }

        return this
    }

    getResponse () {
        const errorMessage = {
            500: 'Произолша ошибка на сервере, попробуйте повторить позже',
            401: 'Произошла ошибка авторизации, возможно вы не авторизованы.',
            403: 'Недостаточно прав.'
        }
        const r = this.__rawResponse
        const e = this.__rawResponseError
        const errorTypeNames = {
            cors: 'Ошибка CORS',
            offline: 'Нет соединения с сервером',
            server_error: 'Ошибка во время выполнения запроса',
            unauthorized: 'Ошибка авторизации',
            aborted: 'Запрос был отменен'
        }

        const out = {
            original: r,
            status: r.status || 0,
            filename: null,
            data: this._loadedData,
            isSuccess: this._isFailedToReadData || this.__responseErrorType !== false // !this.isCurrentParamsAsRequestParams ||
                ? false
                : r && r.status && [200, 201, 202, 204].includes(r.status) && !r.message,
            isSheduled: false,
            params: {
                hash: this.__requestParamsOnRequest,
                get: this._getparams,
                post: this._postparams
            },
            error: {
                errorObj: e || null,
                name: this.__responseErrorType
                    ? this.__responseErrorType
                    : this._isFailedToReadData
                        ? 'Response read error'
                        : e.name || '',
                isAborted: e.name === 'AbortError' || e.code === 20,
                isChangedQueryParams: !this.isCurrentParamsAsRequestParams,
                message: this.__responseErrorType
                    ? errorTypeNames[this.__responseErrorType]
                    : this._isFailedToReadData
                        ? 'Ошибка при чтении ответа сервера'
                        : r.message
                            ? r.message
                            : (!r && !e)
                                ? 'Невозможно выполнить запрос к серверу'
                                : 'Произошла ошибка во время запроса'
            }
        }

        if (this.__isFile) {
            out.filename = r.headers.get('filename') ?? 'unnamedFile'
        }
        if (!r && e && !out.error.isAborted) console.error('Error on request!', e) // если ответа вообще нет и произошла ошибка во время выполнения запроса
        if (r && r.status && ![200, 201, 204].includes(r.status)) { // если ответ от сервера есть, но статус не успешный
            out.error.message =
                (this._loadedData && 'message' in this._loadedData)
                    ? this._loadedData.message // записываем сообщение об ошибке из ответа сервера
                    : r.status in errorMessage
                        ? errorMessage[r.status] // записываем сообщение об ошибке из заранее определенного списка ошибок по коду ответа
                        : 'Статус ответа сервера ' + r.status // записываем в сообщение об ошибке код ответа сервера
        }

        return out
    }
}


// модуль подготовки запроса: кэш, наличие сети
class Query {
    _globalAPI = null
    _isValid = true
    _abortController = new AbortController()
    _actionPath = ''
    _actionParams = null
    _params = {
        isAbsoluteUrl: false,
        url: '',
        method: 'GET',
        headers: {},
        getparams: {},
        postparams: {},
        isAllowCaching: true,
        isAuth: true,
    }

    __taskId = false

    _fetchRequest = new FetchRequest()

    __getActionByPath (path) {
        let out = this._globalAPI.actionModules
        for (const pathItem of path.split('/')) {
            if (pathItem in out) {
                out = out[pathItem]
            } else {
                console.error('api action "' + path + '" not found')
                return false
            }
        }
        return out
    }

    constructor (api, path, ...apiParams) { this._globalAPI = api; this.setParams(path, ...apiParams) }

    setParams (path, ...apiParams) {
        const actionParams = this.__getActionByPath(path)
        if (!actionParams) {
            this._isValid = false
            console.error('Указанного запроса к api не существует', { path })
            return false
        }
        this._actionPath = path
        this._actionParams = apiParams
        if (typeof actionParams === 'object') {
            this._params = { ...this._params, ...actionParams }
        } else if (typeof actionParams === 'function') {
            this._params = { ...this._params, ...actionParams(...apiParams) }
        }
        for (const paramKey of ['headers', 'getparams', 'postparams']) if (typeof this._params[paramKey] !== 'object') this._params[paramKey] = {}
        this.__setRequest()
        return this
    }

    __setRequest () {
        this._fetchRequest
            .setVm(this._globalAPI.rootVm)
            .setUrl(this._params.isAbsoluteUrl ? this._params.url : (this._globalAPI.apiHost + '/') + this._params.url)
            .setMethod(this._params.method)
            .setHeaders(this._params.headers)
            .setGetparams(this._params.getparams)
            .setPostparams(this._params.postparams)
            .setAbortController(this._abortController)
    }

    getAbortController () {
        return this._abortController
    }

    _getCache () {
        this._globalAPI.checkCache()
        if (this._params.isAllowCaching && this._fetchRequest.requestHash in this._globalAPI.fetchCache) {
            const cached = this._globalAPI.fetchCache[this._fetchRequest.requestHash]
            const cachedUntil = moment(parseInt((cached.requestTime + cached.cacheLiveTime) * 1000))
            console.debug('request recovered from cache', {
                request: this._fetchRequest._url,
                cachedUntil: cachedUntil.format('YYYY-MM-DD HH:mm:ss'),
                remainedMinutes: cachedUntil.diff(moment(), 'minutes'),
                remainedSeconds: cachedUntil.diff(moment(), 'seconds')
            })
            return cached
        }
        return false
    }

    _setCache (response) {
        if (!this._fetchRequest.isCurrentParamsAsRequestParams) return false
        // отмена кэширования если период запроса включает будущее время
        const isAllowCaching = this._params.isAllowCaching && 'to' in this._fetchRequest._getparams ? moment(this._fetchRequest._getparams.to).diff(moment()) < 0 : this._params.isAllowCaching
        // включается быстрое кэширование, если период запроса включает текущий день
        // const isLongCache = 'to' in this._fetchRequest._getparams ? moment(this._fetchRequest._getparams.to).diff(moment().startOf('day')) < 0 : false
        const isLongCache = false

        if (isAllowCaching && response.isSuccess && [200, 201].includes(response.status)) {
            this._globalAPI.fetchCache[this._fetchRequest.requestHash] = {
                cacheLiveTime: isLongCache ? 15 * 60 : 10, // быстрый кэш на 10 сек, долгий на 15 минут
                requestTime: Date.now() / 1000 | 0,
                response,
                options: this._fetchRequest.requestOptions
            }
            const cached = this._globalAPI.fetchCache[this._fetchRequest.requestHash]
            const cachedUntil = moment(parseInt((cached.requestTime + cached.cacheLiveTime) * 1000))
            console.debug('caching request', {
                request: this._fetchRequest._url,
                cachedUntil: cachedUntil.format('YYYY-MM-DD HH:mm:ss'),
                remainedMinutes: cachedUntil.diff(moment(), 'minutes')
            })
        }
    }

    async request () {
        this.__setRequest()

        const cache = this._getCache()
        if (cache) {
            return cache.response
        }

        await this._fetchRequest.request()
        const response = this._fetchRequest.getResponse()

        if (!response.isSuccess && response.error.name === 'offline') {
            this._globalAPI.rootVm.$store.commit('app/queue/setNetworkErr', true)
        }

        if (!response.isSuccess && response.error.name === 'offline' && this._params.sheduleQueue) {
            response.isSheduled = true
        }

        if (!response.isSheduled) {
            this._setCache(response)
        }
        return response
    }
}

export default api
