import idb from './indexed-db'

export default {

    async getLists () {
        return idb.getObjects('list')
    },

    async saveList (list) {
        return idb.saveObject('list', list)
    },

    async getItems (listId) {
        return idb.getObjectsBy('item', { listid: listId })
    }

}
