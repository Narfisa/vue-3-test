const routes = [
    { path: '/', redirect: '/home' },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Main.vue'),
    },
    {
        path: '/directory',
        name: 'Directory',
        component: () => import('../views/Directory.vue'),
    }
]

export default routes
