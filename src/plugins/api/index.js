import ApiClass from './api'

const api = new ApiClass()

export default function install(Vue) {
    Vue.config.globalProperties.$api = api
}
