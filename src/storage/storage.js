import indexedDB from './IndexedDB/storage-idb'
import localStorage from './localStorage/storage-local'

let storage = indexedDB

if (window.Cypress) {
    storage = localStorage
}

export default {

    createLocalAnonymousUser () {
        return {
            uid: 'Anonymous',
            isAnonymous: true
        }
    },

    async getLists (userId) {
        debugger
        return storage.getLists(userId)
    },

    async getList (userId, listId) {
        return storage.getList(userId, listId)
    },

    async saveList (userId, list) {
        return storage.saveList(userId, list)
    },

    async saveLists (userId, lists) {
        return storage.saveLists(userId, lists)
    },

    async deleteList (userId, listId) {
        return storage.deleteList(userId, listId)
    },

    async getListItems (userId, listId) {
        return storage.getListItems(userId, listId)
    },

    async getListItem (userId, listId, itemId) {
        return storage.getListItem(userId, listId, itemId)
    },

    async saveListItem (userId, listItem) {
        return storage.saveListItem(userId, listItem)
    },

    async saveListItems (userId, listItems) {
        return storage.saveListItems(userId, listItems)
    }

}
