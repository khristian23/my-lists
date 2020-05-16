import Vue from 'vue'
import Router from 'vue-router'

import ListManager from '@/views/ListManager.vue'

Vue.use(Router)

// Lazy loading sub pages
export default new Router({
    routes: [{
        path: '/',
        name: 'list-manager',
        component: ListManager
    }, {
        path: '/list/:id',
        name: 'list',
        component: () => import(/* webpackChunkName: "ListDetails" */ '@/views/ListDetails')
    }, {
        path: '/list/:list/item/:id',
        name: 'item',
        component: () => import(/* webpackChunkName: "ListItem" */ '@/views/ListItem')
    }]
})
