import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/MainPage.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router