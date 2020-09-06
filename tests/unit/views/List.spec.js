import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import ConstantsPlugin from '@/plugins/constants'
import { strings } from '@/mixins/strings'

import List from '@/views/List.vue'
import ListClass from '@/storage/List'
import sinon from 'sinon'
import storage from '@/storage/storage'
import Consts from '@/util/constants'

const assert = require('assert')
const flushPromises = require('flush-promises');

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(ConstantsPlugin)
localVue.mixin(strings)

const routes = [{ path: '/list/:id', name: 'list', component: List }]

const router = new VueRouter({
  routes
})

describe('List View', () => {
    let wrapper
    beforeEach(() => {
        wrapper = shallowMount(List, {
            propsData: {
                user: 'Christian'
            },
            localVue,
            router
        })
    })

    it('should populate an initial set of values on new Lists', async () => {
        router.push({ name: 'list', params: { id: 'new' } })

        await flushPromises()
        assert.equal(wrapper.vm.listId, null)
        assert.equal(wrapper.vm.name, '')
        assert.equal(wrapper.vm.description, '') 
        assert.equal(wrapper.vm.type, Consts.lists.types[0].id)
        assert.equal(wrapper.vm.subtype, Consts.lists.types[0].subTypes[0].id)
        assert.equal(wrapper.vm.title, 'Create List')
    })

    it('should be able to populate list values of existent list', async () => {
        const stub = sinon.stub(storage, 'getList').returns({ 
            name: 'Christian',
            description: 'List description',
            type: 'shop',
            subtype: 'groceries'
        })

        assert.ok(wrapper.vm.$route instanceof Object)

        router.push({ name: 'list', params: { id: 200 } })

        await flushPromises()
        assert.equal(wrapper.vm.listId, 200)
        assert.equal(wrapper.vm.name, 'Christian')
        assert.equal(wrapper.vm.description, 'List description')
        assert.equal(wrapper.vm.type, 'shop')
        assert.equal(wrapper.vm.subtype, 'groceries')
        assert.equal(wrapper.vm.title, 'Christian')
    })

    it('should change the subtype based on type changes', () => {
        Consts.lists.types.forEach(type => {
            wrapper.vm.type = type.id
            wrapper.vm.onTypeSelection()
            if (type.subTypes.length) {
                assert.equal(wrapper.vm.subtype, type.subTypes[0].id)
            } else {
                assert.equal(wrapper.vm.subtype, undefined)
            }
        })
    })

    it('should emit save list event with proper list values', () => {
        const validate = sinon.stub(wrapper.vm, 'validate').returns(true)

        wrapper.vm.name = 'Christian List Name'
        wrapper.vm.description = 'Christian List Description'
        wrapper.vm.type = 'wish'
        wrapper.vm.subtype = null

        wrapper.vm.onSave()

        const listToSave = wrapper.emitted('saveList')[0][0]
        assert.ok(listToSave instanceof ListClass, 'Wrong object type')
        assert.equal(listToSave.name, 'Christian List Name')
        assert.equal(listToSave.description, 'Christian List Description')
        assert.equal(listToSave.type, 'wish')
        assert.equal(listToSave.subtype, null)
    })
})