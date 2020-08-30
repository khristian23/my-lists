import storage from '@/storage/localStorage/storage-local'
import List from '@/storage/List'
import { isFunction } from 'util'

const assert = require('assert')

describe('Local Storage', () => {
    before(() => {
        storage.reset()
    })

    function createListWithId (id) {
        return new List({
            id: id,
            name: 'List' + id
        })
    }

    async function createListWithIdAndRetrieveAllLists (userId, id) {
        await storage.saveList(userId, createListWithId(id))
        return storage.getAllLists()
    }

    async function assertListProperties (userId, listId, name) {
        const list = await storage.getList(userId, listId)
        assert.ok(list instanceof List, 'not an instance of List')
        assert.equal(list.id, listId, 'wrong list Id')
        assert.equal(list.name, name, 'wrong list name')
    }

    describe('Initial assessments', () => {
        it('returns a Promise when calling storage API', () => {
            assert.ok(!!storage.getAllLists().then)
            assert.ok(!!storage.getLists().then)
            assert.ok(!!storage.saveList().then)
            assert.ok(!!storage.getList().then)
        })

        it('initially retrieves zero lists', async () => {
            const lists = await storage.getAllLists()
            assert.equal(lists.length, 0)
        })
    })

    describe('Specific User Id', () => {
        const userId = 'Christian'

        it ('should not retrieve lists for the user', async () => {
            const lists = await storage.getLists(userId)
            assert.equal(lists.length, 0, 'wrong number of lists')
        })

        it('should add a list', async () => {
            const lists = await createListWithIdAndRetrieveAllLists(userId, 100)
            assert.equal(lists.length, 1, 'wrong number of lists')
        })
        
        it('should retrieve the created list', async () => {
            await assertListProperties(userId, 100, 'List100')
        })

        it('should create a second list', async () => {
            const lists = await createListWithIdAndRetrieveAllLists(userId, 200)
            assert.equal(lists.length, 2, 'wrong number of lists')
        })

        it('should retrieve the second created list', async () => {
            await assertListProperties(userId, 200, 'List200')
        })

        it('should not retrieve a non existent list', async () => {
            const list = await storage.getList(userId, 300)
            assert.ok(!list)
        })

        it ('should update an existent list', async () => {
            const list = await storage.getList(userId, 100)
            list.name = 'new name'
            await storage.saveList(userId, list)
            await assertListProperties(userId, 100, 'new name')
        })

        it ('should retrieve all lists for the user', async () => {
            const lists = await storage.getLists(userId)
            assert.equal(lists.length, 2, 'wrong number of lists')
        })
    })

    describe('A second user', () => {
        const userId = 'AnotherUser'

        it('should add a list for Another User', async () => {
            const lists = await createListWithIdAndRetrieveAllLists(userId, 300)
            assert.equal(lists.length, 3, 'wrong number of lists')
        })

        it('should retrieve the created list', async () => {
            await assertListProperties(userId, 300, 'List300')
        })

        it ('should retrieve all lists for another user', async () => {
            const lists = await storage.getLists(userId)
            assert.equal(lists.length, 1, 'wrong number of lists')
        })
    })
})
