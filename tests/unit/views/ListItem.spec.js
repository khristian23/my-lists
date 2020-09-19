import { shallowMount } from '@vue/test-utils'
import { localVue, router } from './routerVueSetup'
import ListItemView from '@/views/ListItem'
import Consts from '@/util/constants'
import assert from 'assert'
import flushPromises from 'flush-promises'

describe('List Item View', () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(ListItemView, {
            localVue,
            router
        })
    })

    it('should be able to create a new item', async () => {
        router.push({ name: Consts.routes.ListItem, params: { list: 100, id: 'new' } })
        await wrapper.setProps({ user: { uid: 'Christian'} })
        await flushPromises()

        assert.strictEqual(wrapper.vm.itemId, null, 'initial item id')
        assert.strictEqual(wrapper.vm.listId, 100, 'get list id from router')
        assert.strictEqual(wrapper.vm.item, null, 'initial list object')
        assert.strictEqual(wrapper.vm.name, '', 'Initial name field')
        assert.strictEqual(wrapper.vm.title, 'New Item', 'Title set')
    })

    it('should throw an exception when no list Item is found', async () => {})
})