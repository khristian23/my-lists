import storage from './IndexedDB/storage-idb'

export default {

    createLocalAnonymousUser () {
        return {
            uid: 'Anonymous',
            isAnonymous: true
        }
    },

    async getLists (userId) {
        return storage.getLists(userId)
    },

    async getList (userId, listId) {
        return storage.getList(userId, listId)
    },

    async saveList (userId, list) {
        return storage.saveList(userId, list)
    },

    async deleteList (userId, listId) {
        return storage.deleteList(userId, listId)
    },

    async getItems (userId, listId) {
        return storage.getItems(userId, listId)
    },

    async saveListItem (userId, listId, listItem) {
        return storage.saveListItem(userId, listId, listItem)
    }

}
