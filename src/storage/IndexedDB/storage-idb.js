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

    async saveList (userId, list) {
        let listToSave = list
        listToSave.userId = userId
        listToSave.modifiedAt = new Date().getTime()
        return idb.saveObject('list', listToSave)
    },

    async getItems (userId, listId) {
        return idb.getObjectsBy('item', { listId: listId })
    },

    async saveListItem (userId, listId, listItem) {
        let listItemToSave = Object.assign({}, listItem, {
            userId: userId,
            listId: listId,
            modifiedAt: new Date().getTime()
        })
        return idb.saveObject('item', listItemToSave)
    }

}
