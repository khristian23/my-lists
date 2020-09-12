import idb from './indexed-db'
import Constants from '@/util/constants'
import List from '@/storage/List'
import ListItem from '@/storage/ListItem'

export default {

    getObject (object) {
        if (object instanceof List || object instanceof ListItem) {
            return object.toObject()
        }
        return object
    },

    async getLists (userId) {
        return idb.getObjectsBy('list', { userId: userId })
    },

    async getList (userId, listId) {
        const list = await idb.getObjectsBy('list', { id: listId })
        if (!list || list.userId !== userId) {
            return null
        }
        return list
    },

    setModificationStatus (userId, object) {
        object.syncStatus = Constants.changeStatus.changed
        object.modifiedAt = new Date().getTime()
        object.userId = userId
    },

    async saveObject (table, userId, object) {
        this.setModificationStatus(userId, object)

        const objectToSave = this.getObject(object)
        if (object.id) {
            return idb.updateObject(table, objectToSave)
        }

        delete object.id
        return idb.addObject(table, objectToSave)
    },

    async saveList (userId, list) {
        return this.saveObject('list', userId, list)
    },

    async deleteList (userId, listId) {
        const list = await this.getList(userId, listId)
        if (!list) {
            const error = 'List not found'
            throw error
        }
        await idb.deleteObjectsBy('item', { listId: listId })
        return idb.deleteObjectsBy('list', { id: listId })
    },

    async getListItems (userId, listId) {
        return idb.getObjectsBy('item', { listId: listId })
    },

    async getListItem (userId, listId, itemId) {
        const item = await idb.getObjectsBy('item', { id: itemId })
        if (!item || item.userId !== userId || item.listId !== listId) {
            return null
        }
        return item
    },

    async saveListItem (userId, listItem) {
        return this.saveObject('item', userId, listItem)
    },

    processObjectsToSave (table, userId, objects) {
        objects.forEach(object => this.setModificationStatus(userId, object))
        return idb.updateObjects(table, objects.map(object => this.getObject(object)))
    },

    async saveLists (userId, lists) {
        return this.processObjectsToSave('list', userId, lists)
    },

    async saveListItems (userId, listItems) {
        return this.processObjectsToSave('item', userId, listItems)
    },

    async getLastSynchonizationTimeForUser (userId) {
        return idb.getObjectsBy('sync', { userId: userId })
    }

}
