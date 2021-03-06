// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@ui5/webcomponents-fiori/dist/Assets.js'
import '@/storage/storage'
import { strings } from './mixins/strings'
import Constants from '@/plugins/constants'
import FirebaseUserPlugin from '@/plugins/firebaseUser'

Vue.config.productionTip = false
Vue.config.ignoredElements = [/^ui5-/]
Vue.mixin(strings)
Vue.use(Constants)
Vue.use(FirebaseUserPlugin)

/* eslint-disable no-new */
new Vue({
    render: h => h(App),
    router
}).$mount('#app')
