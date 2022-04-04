import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout'

Vue.use(Router)
const routes = [
    {
        path: '/',
        name: 'Layout',
        component: Layout,
        redirect: '/home',
        children: [{
            path: 'home',
            name: 'Home',
            component: () => import('../views/Home'),
            meta: {
                title: '首页',
                icon: 'vue-dsn-icon-index',
                fixed: true
            }
        }]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
