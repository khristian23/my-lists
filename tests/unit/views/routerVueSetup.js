import { createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import ConstantsPlugin from '@/plugins/constants'
import { strings } from '@/mixins/strings'
import Constants from '@/util/constants'

import List from '@/views/List.vue'
import ListItem from '@/views/ListItem.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(ConstantsPlugin)
localVue.mixin(strings)

const routes = [
    { path: '/list/:id', name: Constants.routes.list, component: List },
    { path: '/list/:list/item/:id', name: Constants.routes.listItem, component: ListItem }
]

const router = new VueRouter({ 
    routes
 })

export { localVue, router }