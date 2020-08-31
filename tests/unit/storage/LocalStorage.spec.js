import storage from '@/storage/localStorage/storage-local'
import List from '@/storage/List'
import ListItem from '../../../src/storage/ListItem'

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

    function createListItemWithId (id) {
        return new ListItem({
            id: id,
            name: 'ListItem' + id
        })
    }

    async function createAndSaveList (userId, listId) {
        return storage.saveList(userId, createListWithId(listId))
    }

    async function createListWithIdAndAssertAllListsCount (userId, id, listCount) {
        await createAndSaveList(userId, id)
        const lists = await storage.getAllLists()
        assert.equal(lists.length, listCount, 'wrong number of lists')
    }

    async function assertListProperties (userId, listId, name) {
        const list = await storage.getList(userId, listId)
        assert.ok(list instanceof List, 'not an instance of List')
        if (listId) {
            assert.ok(Number.isInteger(list.id), 'Id is NaN')
        } else {
            assert.equal(list.id, listId , 'wrong list Id')
        }
        assert.equal(list.name, name, 'wrong list name')
    }

    async function assertUserListCount (userId, listCount) {
        const lists = await storage.getLists(userId)
        assert.equal(lists.length, listCount, 'wrong number of lists')
        lists.forEach(list => assert.ok(list instanceof List))
    }

    function assertListItems (newLists, savedLists) {
        assert.equal(newLists.length, savedLists.length, 'wrong number of list items')
        newLists.forEach((newList, index) => {
            const savedList = savedLists[index]
            assert.equal(newList.id, savedList.id, 'wrong item id')
            assert.equal(newList.name, savedList.name, 'wrong item name')
        })
    }

    describe('Initial assessments', () => {
        it('initially retrieves zero lists', async () => {
            const lists = await storage.getAllLists()
            assert.equal(lists.length, 0)
        })
    })

    describe('Specific User Id', () => {
        const userId = 'Christian'

        it ('should not retrieve lists for the user', async () => {
            assertUserListCount(userId, 0)
        })

        it('should add a list', async () => {
            createListWithIdAndAssertAllListsCount(userId, 100, 1)
        })
        
        it('should retrieve the created list', async () => {
            assertListProperties(userId, 100, 'List100')
        })

        it('should create a second list', async () => {
            createListWithIdAndAssertAllListsCount(userId, 200, 2)
        })

        it('should retrieve the second created list', async () => {
            assertListProperties(userId, 200, 'List200')
        })

        it('should not retrieve a non existent list', async () => {
            const list = await storage.getList(userId, 300)
            assert.ok(!list)
        })

        it ('should update an existent list', async () => {
            const list = await storage.getList(userId, 100)
            list.name = 'new name'
            await storage.saveList(userId, list)
            assertListProperties(userId, 100, 'new name')
        })

        it ('should retrieve all lists for the user', async () => {
            assertUserListCount(userId, 2)
        })

        it ('should delete a list', async () => {
            await storage.deleteList(userId, 100)
            assertUserListCount(userId, 1)
        })
    })

    describe('A second user', () => {
        const userId = 'AnotherUser'

        it('should add a list for Another User', async () => {
            createListWithIdAndAssertAllListsCount(userId, 300, 2)
        })

        it('should retrieve the created list', async () => {
            await assertListProperties(userId, 300, 'List300')
        })

        it('should create list with ramdom id', async () => {
            createListWithIdAndAssertAllListsCount(userId, undefined, 3)
        })

        it('should retrieve the created list with undefined id', async () => {
            const lists = await storage.getLists(userId)
            lists.forEach(list => assert.ok(Number.isInteger(list.id)))
        })
        it ('should retrieve all lists for another user', async () => {
            assertUserListCount(userId, 2)
        })
    })

    describe('List Items', () => {
        const userId = 'listItemUser'

        it('should create a list with no items', async () => {
            createAndSaveList(userId, 400)
            const list = await storage.getList(userId, 400)
            assert.equal(list.listItems.length, 0)
        })

        it('should create a list with items', async () => {
            const newList = createListWithId(500)
            newList.addListItem(createListItemWithId(501))
            await storage.saveList(userId, newList)

            const savedList = await storage.getList(userId, 500)
            assertListItems(newList.listItems, savedList.listItems)
        })
    })
})
