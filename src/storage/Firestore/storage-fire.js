import firestore from './firestore'
import List from '@/storage/List'
import ListItem from '@/storage/ListItem'

export default {

    getFirebaseObject (object) {
        if (object instanceof List || object instanceof ListItem) {
            return object.toFirebaseObject()
        } else {
            throw new Error('Unexpected object type')
        }
    },

    async saveList (userId, list) {
        const firebaseList = this.getFirebaseObject(list)

        try {
            const userRef = firestore.collection('users').doc(userId)
            const listsRef = userRef.collection('lists')

            if (firebaseList.firebaseId) {
                const listRef = listsRef.doc(firebaseList.firebaseId)
                await listRef.set(firebaseList)
            } else {
                const docRef = await listsRef.add(firebaseList)
                firebaseList.firebaseId = docRef.id
            }
        } catch (e) {
            throw new Error(e.message)
        }

        return firebaseList.firebaseId
    },

    async saveListItem (userId, firebaseListId, listItem) {
        const firebaseListItem = this.getFirebaseObject(listItem)

        try {
            const userRef = firestore.collection('users').doc(userId)
            const listRef = userRef.collection('lists').doc(firebaseListId)
            const itemsRef = listRef.collection('items')

            if (firebaseListItem.firebaseId) {
                const itemRef = itemsRef.doc(firebaseListItem.firebaseId)
                await itemRef.set(firebaseListItem)
            } else {
                const docRef = await itemsRef.add(firebaseListItem)
                firebaseListItem.firebaseId = docRef.id
            }
        } catch (e) {
            throw new Error(e.message)
        }

        return firebaseListItem.firebaseId
    },

    async getLists (userId) {
        const results = []
        const userRef = firestore.collection('users').doc(userId)
        const listsCollection = userRef.collection('lists')
        const listsRef = await listsCollection.get()

        for (const firebaseList of listsRef.docs) {
            const list = new List(firebaseList.data())
            list.id = firebaseList.id

            const items = await listsCollection.doc(list.id).collection('items').get()
            for (const item in items.docs) {
                const listItem = new ListItem(item.data())
                listItem.id = item.id
                listItem.listId = list.id
                list.addListItem(listItem)
            }
            results.push(list)
        }

        return results
    },

    async deleteList (userId, firebaseId) {
        const userRef = firestore.collection('users').doc(userId)
        const listRef = userRef.collection('lists').doc(firebaseId)
        const items = await listRef.collection('items').get()

        for (const item in items.docs) {
            await item.delete()
        }

        return listRef.delete()
    },

    async deleteListItem (userId, firebaseId, firebaseItemId) {
        const userRef = firestore.collection('users').doc(userId)
        const listRef = userRef.collection('lists').doc(firebaseId)
        const itemRef = listRef.collection('items').doc(firebaseItemId)
        return itemRef.delete()
    }

}
