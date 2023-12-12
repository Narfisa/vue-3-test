import { createStore } from 'vuex'

import app from './app'
import layout from './layout'
import storeM from './store'

const modules = {
    app,
    layout,
    store: storeM
}

const store = createStore({
    modules,
    state: {},
    actions: {},
    mutations: {}
})

export default store
