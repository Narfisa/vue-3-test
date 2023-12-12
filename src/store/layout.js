const store = {
    state: {
        menu: [
            {
                title: 'Справочник тегов',
                key: 'directory',
                path: 'directory'
            },
            {
                title: 'Главная',
                key: 'home',
                path: 'home'
            },
            {
                title: 'Избранное',
                key: 'favorites',
                path: 'favorites'  
            }
        ]
    },
    actions: {},
    mutations: {},
    namespaced: true,
}

export default store