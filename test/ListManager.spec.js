import ListManager from '@/views/ListManager.vue'
import { mount } from '@vue/test-utils'

describe('List Manager', function () {
    it('should mount a vue component', function () {
        const wrapper = mount(ListManager)
        console.log(wrapper)
    })
})