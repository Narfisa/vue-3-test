type State = {
    breeds: Record<string, string[]>,
    favoriteBreeds: Array<string>
}


const state = {
    breeds: [],
    favoriteBreeds: []
}

const mutations = {
    setBreeds (state: State, value: State['breeds']) {
        state.breeds = value
    }
}

const module = {
    namespaced: true,
    state,
    actions: {},
    mutations,
}

export default module
