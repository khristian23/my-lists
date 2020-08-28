import List from '@/storage/List'
import ListItem from '@/storage/ListItem'

export default {
    getItem (key) {
        return localStorage.getItem(key)
    },

    setItem (key, objectString) {
        localStorage.setItem(key, objectString)
    },

    async getLists (userId) {
        debugger
        console.error('nice')
        return idb.getObjectsBy('list', { userId: userId })
    },
}