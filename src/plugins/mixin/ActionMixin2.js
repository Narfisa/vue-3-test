import { ref, onBeforeUnmount } from 'vue'

export function mixin(api) {
    const systemAbortControllers = ref({})

    async function request(path, ...apiParams) {
        if (path in systemAbortControllers.value) {
            console.debug('Отмена текущего запроса из-за повторного вызова ', path)
            systemAbortControllers.value[path].abort()
        }

        const query = api.query(path, ...apiParams)
        systemAbortControllers.value[path] = query.getAbortController()

        const r = await query.request()

        if (!r.error.isAborted) {
            delete systemAbortControllers.value[path]
        } else if (r.error.isChangedQueryParams) {
            console.warn('Параметры запроса поменялись во время выполнения, но прошлый запрос не был отменен')
        }

        return r
    }

    function requestError(r) {
        if (r && r.error.isAborted) return false
        console.error('error', r.error.message)
    }

    function processReportResponse(r) {
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

    onBeforeUnmount(() => {
        for (const path in systemAbortControllers.value) {
            const abortController = systemAbortControllers.value[path]
            abortController.abort()
        }
    })

    return {
        systemAbortControllers,
        request,
        requestError,
        processReportResponse
    }
}
