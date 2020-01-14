import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from '@/views/Login.vue'
import Index from '@/views/Index.vue'
import Welcome from '@/views/Welcome.vue'
import Postlist from '@/views/Postlist.vue'
import PostPublish from '@/views/PostPublish.vue'

let router = new VueRouter({
    routes: [
        {
            name: 'Login',
            path: '/login',
            component: Login
        },
        {
            name: 'Index',
            path: '/index',
            component: Index,
            // 添加重定向，显示欢迎信息
            redirect: { name: 'Welcome' },
            children: [
                {
                    name: 'Welcome',
                    path: 'welcome',
                    component: Welcome
                },
                {
                    name: 'Postlist',
                    path: 'postlist',
                    component: Postlist
                },
                {
                    name: 'PostPublish',
                    path: 'postpublish',
                    component: PostPublish
                }
            ]
        }
    ]
})


router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        let token = localStorage.getItem('houtai_key')
        if (token) {
            next()
        } else {
            next('/login')
        }
    }
})
export default router