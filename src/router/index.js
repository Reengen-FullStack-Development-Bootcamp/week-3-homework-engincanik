import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/MainPage.vue')
    },
    {
        path: '/result/',
        name: 'Result',
        props: true,
        component: () => import('@/views/ResultPage.vue')
    },
    {
        path: '/logs/',
        name: 'Logs',
        props: true,
        component: () => import('@/views/LogPage.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router