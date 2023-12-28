const routes = [
    { path: '/', redirect: '/home' },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@views/Main.vue'),
    },
    {
        path: '/directory',
        name: 'Directory',
        component: () => import('@views/Directory.vue'),
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: () => import('@views/Favorites.vue'),
    }
]

export default routes
