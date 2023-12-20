const routes = [
    { path: '/', redirect: '/home' },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/main/Main.vue'),
    },
]

export default routes
