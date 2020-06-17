import idb from './indexed-db'

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

    async saveObject (table, userId, object) {
        let objectToSave = Object.assign({}, object, {
            userId: userId,
            modifiedAt: new Date().getTime()
        })

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
        return idb.deleteObject('list', list)
    },

    async getItems (userId, listId) {
        return idb.getObjectsBy('item', { listId: listId })
    },

    async saveListItem (userId, listItem) {
        return this.saveObject('item', userId, listItem)
    }

}
