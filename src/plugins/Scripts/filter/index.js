import FilterScript from './FilterScript'

export default function install(Vue) {
    Vue.config.globalProperties.$LivecycleScript = new FilterScript(Vue.config.globalProperties)
}
