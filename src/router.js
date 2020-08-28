import Vue from 'vue'
import Router from 'vue-router'

import Lists from '@/views/Lists.vue'
import Consts from '@/util/constants'

Vue.use(Router)

// Lazy loading sub pages
export default new Router({
    routes: [{
        path: '/',
        name: Consts.routes.lists,
        component: Lists
    }, {
        path: '/list/:id/items',
        name: Consts.routes.listItems,
        component: () => import(/* webpackChunkName: "ListDetails" */ '@/views/ListDetails')
    }, {
        path: '/list/:list/item/:id',
        name: Consts.routes.listItem,
        component: () => import(/* webpackChunkName: "ListItem" */ '@/views/ListItem')
    }, {
        path: '/list/:id',
        name: Consts.routes.list,
        component: () => import(/* webpackChunkName: "EditList" */ '@/views/EditList')
    }, {
        path: '/login',
        name: Consts.routes.login,
        component: () => import(/* webpackChunkName: "Login" */ '@/views/Login')
    }, {
        path: '/register',
        name: Consts.routes.register,
        component: () => import(/* webpackChunkName: "Register" */ '@/views/Register')
    }, {
        path: '/profile',
        name: Consts.routes.profile,
        component: () => import(/* webpackChunkName: "Profile" */ '@/views/Profile')
    }]
})
