import stateT from '@interface/store/app' 

import directory from './page/directory'

const state = {
    currentPage: null,
    windowType: 'desktop'
}

const mutations = {
    setCurrentPage (state:stateT, value:string) {
        if (state.currentPage === value) return
        state.currentPage = value
    },
    setWindowType (state:stateT, value:string) { state.windowType = value }
}

export default {
    namespaced: true,
    state,
    actions: {},
    modules: { directory },
    mutations
}
