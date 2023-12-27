import stateT from '@/typescript/store/app' 

import directory from './page/directory'

const state = {
    currentPage: null,
    windowType: 'desktop'
}

const mutations = {
    setCurrentPage (state:stateT, value:stateT['currentPage']) {
        if (state.currentPage === value) return
        state.currentPage = value
    },
    setWindowType (state:stateT, value:stateT['windowType']) { state.windowType = value }
}

export default {
    namespaced: true,
    state,
    actions: {},
    modules: { directory },
    mutations
}
