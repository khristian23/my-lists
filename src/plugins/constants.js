import Const from '@/util/constants'

const Constants = {
    install (Vue, options) {
        Vue.prototype.$Const = Const
    }
}

export default Constants
