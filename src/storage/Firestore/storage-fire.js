import firestore from './firestore'
import firebase from 'firebase'
import List from '@/storage/List'
import ListItem from '@/storage/ListItem'

export default {

    // async _getUserDocument (userId) {
    //     return firestore.collection('users').doc(userId)
    // },

    // async getLists (userId) {
    //     return new Promise(resolve => {
    //         firestore.collection('users').doc(userId)
    //             .collection('lists')
    //             .onSnapshot(snapshots => {
    //                 const lists = snapshots.docs.map(doc => {
    //                     return {
    //                         id: doc.id,
    //                         name: doc.data().name,
    //                         description: doc.data().description
    //                     }
    //                 })
    //                 resolve(lists)
    //             })
    //     })
    // },

    // getListData (list) {
    //     return {
    //         name: list.name,
    //         description: list.description,
    //         type: list.type,
    //         subtype: list.subtype,
    //         priority: list.priority || 0,
    //         modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
    //     }
    // },

    getFirebaseObject (object) {
        if (object instanceof List || object instanceof ListItem) {
            return object.toFirebaseObject()
        } else {
            throw new Error('Unexpected object type')
        }
    },

    async saveList (userId, list) {
        firebaseList = this.getFirebaseObject(list)

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

    // getListItemData (listItem) {
    //     return {
    //         name: listItem.name,
    //         status: listItem.status,
    //         priority: listItem.priority || 0,
    //         modifiedAt: listItem.modifiedAt
    //     }
    // },

    async saveListItem (userId, firebaseListId, listItem) {
        firebaseListItem = this.getFirebaseObject(listItem)

        try {
            const userRef = firestore.collection('users').doc(userId)
            const listRef = userRef.collection('lists').doc(firebaseListId)
            const itemsRef = listRef.collection('items')

            if (firebaseListItem.firebaseId) {
                const itemRef = itemsRef.doc(firebaseListItem.firebaseId)
                await listRef.set(firebaseListItem)
            } else {
                const docRef = await itemsRef.add(firebaseListItem)
                firebaseListItem.firebaseId = docRef.id
            }
        } catch (e) {
            throw new Error(e.message)
        }

        return firebaseListItem.firebaseId
    },

    // async getItems (listId) {
    //     return firestore.getItems(listId)
    // },

    async getListsForSynchronization (userId, fromTimestamp) {
        const results = []
        const userRef = firestore.collection('users').doc(userId)
        const listsRef = userRef.collection('lists')
        const querySnapshots = await listsRef.where('modifiedAt', '>', fromTimestamp).get()

        for (const modifiedList of querySnapshots.docs) {
            const list = new List(modifiedList.data())
            list.firebaseId = modifiedList.id

            const items = await listsRef.doc(list.id).collection('items').get()
            for (const item in items.docs) {
                const listItem = new ListItem(item.data())
                listItem.firebaseId = item.id
                listItem.listId = list.firebaseId
                list.addListItem(listItem)
            }

            results.push(list)
        }

        return results
    }

}
