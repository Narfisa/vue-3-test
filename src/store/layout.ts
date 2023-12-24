// TYPESCRIPT
import Menu from '@interface/store/layout/menu'
import Store from '@interface/store/layout'

const avialableThemes = ['light', 'dark']

const store = {
    state: {
        menu: [
            {
                title: 'Справочник пород',
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
        ] as Array<Menu>,
        theme: localStorage.getItem('theme') || 'light' as string // see avialableThemes
    },
    actions: {},
    mutations: {
        setTheme (state:Store, value:string) {
            if (!avialableThemes.includes(value)) return
            state.theme = value
            localStorage.setItem('theme', value)
        }
    },
    namespaced: true,
}

export default store
