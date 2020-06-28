import Const from '@/util/constants'

let Constants = {
    install (Vue, options) {
        Vue.prototype.$Const = Const
    }
}

export default Constants
