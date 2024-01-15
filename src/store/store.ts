type State = {
    breeds: Record<string, string[]>,
    favoriteBreeds: Array<string>
}


const state = {
    breeds: [],
    favoriteBreeds: (localStorage.getItem('favoriteBreeds') as string)?.split(',') || []
}

const mutations = {
    setBreeds (state: State, value: State['breeds']) {
        state.breeds = value
    },
    setFavoriteBreeds (state: State, value: State['favoriteBreeds']) {
        state.favoriteBreeds = value
        localStorage.setItem('favoriteBreeds', value.join(','))
    }
}

const module = {
    namespaced: true,
    state,
    actions: {},
    mutations,
}

export default module
