import stateT from '@interface/store/app' 

const state = {
    currentPage: null,
    windowType: 'desktop'
}

const mutations = {
    setCurrentPage (state:stateT, value:string) { state.currentPage = value },
    setWindowType (state:stateT, value:string) { state.windowType = value }
}

export default {
    namespaced: true,
    state,
    actions: {},
    mutations
}
