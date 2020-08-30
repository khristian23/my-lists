import List from '@/storage/List'
import ListItem from '@/storage/ListItem'

const KEY = 'MY-LISTS'

export default {

    reset () {
        localStorage.removeItem(KEY)
    },

    _getDataFromStorage () {
        const data = JSON.parse(localStorage.getItem(KEY))
        return data || {}
    },

    _saveDataToStorage (data) {
        localStorage.setItem(KEY, JSON.stringify(data))
    },

    async getAllLists () {
        const users = this._getDataFromStorage()
        let lists = []
        Object.keys(users).forEach(userId => {
            lists = lists.concat(users[userId])
        })
        return Promise.resolve(lists)
    },

    getLists (userId) {
        const users = this._getDataFromStorage()
        return Promise.resolve(users[userId] || [])
    },

    async getList (userId, listId) {
        if (!userId) {
            return Promise.reject()
        }

        const userLists = await this.getLists(userId)
        const listData = userLists.filter(list => list.id === listId)[0]
        if (!listData) {
            return Promise.resolve(null)
        }
        return Promise.resolve(new List(listData))
    },

    async saveList (userId, list) {
        if (!list) {
           return Promise.reject()
        }

        const userLists = await this.getLists(userId)
        let i = 0
        for (; i < userLists.length; i++) {
            if (userLists[i].id === list.id) {
                break
            }
        }
        userLists.splice(i, 1, list.toObject())

        this.saveLists(userId, userLists)

        return Promise.resolve(true)
    },

    async saveLists (userId, lists) {
        const users = this._getDataFromStorage()
        users[userId] = lists
        this._saveDataToStorage(users)
    }
}