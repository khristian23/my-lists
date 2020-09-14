import idb from './indexed-db'
import List from '@/storage/List'
import ListItem from '@/storage/ListItem'

export default {

    getObject (object) {
        if (object instanceof List || object instanceof ListItem) {
            return object.toObject()
        }
        return object
    },

    async getAllLists () {
        return idb.getObjectsBy('list')
    },

    async getLists (userId) {
        const lists = await idb.getObjectsBy('list', { userId: userId }) || []
        return lists.map(list => new List(list))
    },

    async getList (userId, listId) {
        const list = await idb.getObjectsBy('list', { id: listId })

        if (!list || list.userId !== userId) {
            throw Error(`List ID:${listId} not found for user ${userId}`)
        }

        const listInstance = new List(list)

        listInstance.listItems = await this._getListItems(userId, listId)
        return listInstance
    },

    async _getListItems (userId, listId) {
        const items = await idb.getObjectsBy('item', { listId: listId }) || []
        return items.map(item => new ListItem(item))
    },

    async saveObject (table, userId, listObject) {
        listObject.userId = userId

        const objectLiteralToSave = this.getObject(listObject)
        if (listObject.id) {
            await idb.updateObject(table, objectLiteralToSave)
        } else {
            delete objectLiteralToSave.id
            const generatedId = await idb.addObject(table, objectLiteralToSave)
            listObject.id = generatedId
        }
    },

    async saveList (userId, list) {
        if (!(list instanceof List)) {
            throw Error('Wrong list object type')
        }
        await this.saveObject('list', userId, list)

        list.listItems.forEach(async item => {
            item.listId = list.id
            await this.saveListItem(userId, item)
        })
    },

    async saveLists (userId, lists) {
        lists.forEach(async list => await this.saveList(userId, list))
    },

    async saveListItem (userId, listItem) {
        if (!(listItem instanceof ListItem)) {
            throw Error('Wrong List Item object type')
        }

        if (!listItem.listId) {
            throw Error('List Item must have a listId')
        }

        return this.saveObject('item', userId, listItem)
    },

    async saveListItems (userId, listItems) {
        listItems.forEach(async item => await this.saveListItem(userId, item))
    },

    async deleteList (userId, listId) {
        await idb.deleteObjectsBy('item', { listId: listId })
        return idb.deleteObjectsBy('list', { id: listId })
    },

    async getLastSynchonizationTimeForUser (userId) {
        return idb.getObjectsBy('sync', { userId: userId })
    }

}
