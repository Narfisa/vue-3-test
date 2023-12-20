const avialableThemes = ['light', 'dark']

const store = {
    state: {
        menu: [
            {
                title: 'Справочник тегов',
                key: 'directory',
                path: 'directory',
            },
            {
                title: 'Главная',
                key: 'home',
                path: 'home',
            },
            {
                title: 'Избранное',
                key: 'favorites',
                path: 'favorites',
            },
        ],
        theme: 'light' // see avialableThemes
    },
    actions: {},
    mutations: {
        setTheme (state, value) {
            if (!avialableThemes.includes(value)) return
            state.theme = value
        }
    },
    namespaced: true,
}

export default store
