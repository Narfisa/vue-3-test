import ApiClass from './api'

const api = new ApiClass()

export default {
    install (app) {
        app.provide('$api', api)
        app.config.globalProperties.$api = api
    }
}
