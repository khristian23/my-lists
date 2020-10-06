import firebaseAuth from '@/auth/firebaseAuth'

const firebaseUser = {
    install (Vue, options) {
        Vue.prototype.$auth = firebaseAuth()
    }
}

export default firebaseUser