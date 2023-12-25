type State = {
    breed: string
}

const state = {
    breed: null
}

const getters = {
    pageParams (state:State) { // call from livecycle script
        return state.breed
    }
}

const mutations = {
    setPageParams (state: State, value: State['breed']) { // call from livecycle script
        state.breed = value
    },
    setBreed (state: State, value: State['breed']) {
        state.breed = value
    }
}

const module = {
    namespaced: true,
    getters,
    state,
    actions: {},
    mutations,
}

export default module
