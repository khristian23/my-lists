import idb from './indexed-db'
import Constants from '@/util/constants'

export default {

    async getLists (userId) {
        return idb.getObjectsBy('list', { userId: userId })
    },

    async getList (userId, listId) {
        let list = await idb.getObjectsBy('list', { id: listId })
        if (!list || list.userId !== userId) {
            return null
        }
        return list
    },

    setObjectSyncStatus (object) {
        if (object.syncStatus === undefined) {
            object.syncStatus = Constants.status.changed
        }
    },

    async saveObject (table, userId, object) {
        let objectToSave = Object.assign({}, object, {
            userId: userId,
            modifiedAt: new Date().getTime()
        })
        this.setObjectSyncStatus(objectToSave)

        if (object.id) {
            return idb.updateObject(table, objectToSave)
        }
        delete objectToSave.id
        return idb.addObject(table, objectToSave)
    },

    async saveList (userId, list) {
        return this.saveObject('list', userId, list)
    },

    async deleteList (userId, listId) {
        let list = await this.getList(userId, listId)
        if (!list) {
            let error = 'List not found'
            throw error
        }
        await idb.deleteObjectsBy('item', { listId: listId })
        return idb.deleteObjectsBy('list', { id: listId })
    },

    async getListItems (userId, listId) {
        return idb.getObjectsBy('item', { listId: listId })
    },

    async getListItem (userId, listId, itemId) {
        let item = await idb.getObjectsBy('item', { id: itemId })
        if (!item || item.userId !== userId || item.listId !== listId) {
            return null
        }
        return item
    },

    async saveListItem (userId, listItem) {
        return this.saveObject('item', userId, listItem)
    },

    processObjectsToSave (table, userId, objects) {
        let objectToSave = objects
        let modifiedAt = new Date().getTime()
        objectToSave.forEach(object => {
            object.userId = userId
            object.modifiedAt = modifiedAt
            object.syncStatus = Constants.status.changed
        })
        return idb.updateObjects(table, objectToSave)
    },

    async saveLists (userId, lists) {
        return this.processObjectsToSave('list', userId, lists)
    },

    async saveListItems (userId, listItems) {
        return this.processObjectsToSave('item', userId, listItems)
    }

}
