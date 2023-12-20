export default {
    data () {
        return {
            SystemAbortControllers: {}
        }
    },
    methods: {
        async _request (path, ...apiParams) {
            if (path in this.SystemAbortControllers) {
                console.debug('Отмена текущего запроса из-за повторного вызова ', path)
                this.SystemAbortControllers[path].abort()
            }
            const query = this.$api.query(path, ...apiParams)
            this.SystemAbortControllers[path] = query.getAbortController()
            const r = await query.request()
            if (!r.error.isAborted) {
                delete this.SystemAbortControllers[path]
            } else if (r.error.isChangedQueryParams) {
                console.warn('Параметры запроса поменялись во время выполнения, но прошлый запрос не был отменен')
            }
            return r
        },
        _requestError (r) {
            if (r && r.error.isAborted) return false
            console.error('error', r.error.message)
        },
        _processReportResponse (r) {
            if (r.isSuccess) {
                if (!r.filename) {
                    let text = r.data.message ?? 'Не смогли сформировать отчет'
                    if (!r.data.message && r.data?.raw?.message) {
                        text = r.data.raw.message + '. ' + r.data.raw?.description ?? ''
                    }
                    console.error('error', text)
                    return false
                } else {
                    return { file: r.data, filename: r.filename }
                }
            } else {
                console.error('error', r.error.message)
                return false
            }
        }
    },
    beforeDestroy () {
        for (const path in this.SystemAbortControllers) {
            const abortController = this.SystemAbortControllers[path]
            abortController.abort()
        }
    }
}
