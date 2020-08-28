import Lists from '@/views/Lists.vue'
import { mount } from '@vue/test-utils'

describe('List Maintain', function () {
    it('should mount a vue component', function () {
        const wrapper = mount(Lists)
        console.log(wrapper)
    })
})