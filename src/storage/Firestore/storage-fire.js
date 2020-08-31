import firestore from './firestore'
import firebase from 'firebase'
import List from '@/storage/List'
import ListItem from '@/storage/ListItem'

export default {

    async _getUserDocument (userId) {
        return firestore.collection('users').doc(userId)
    },

    async getLists (userId) {
        return new Promise(resolve => {
            firestore.collection('users').doc(userId)
                .collection('lists')
                .onSnapshot(snapshots => {
                    const lists = snapshots.docs.map(doc => {
                        return {
                            id: doc.id,
                            name: doc.data().name,
                            description: doc.data().description
                        }
                    })
                    resolve(lists)
                })
        })
    },

    getListData (list) {
        return {
            name: list.name,
            description: list.description,
            type: list.type,
            subtype: list.subtype,
            priority: list.priority || 0,
            modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
    },

    getFirebaseObject (object) {
        if (object instanceof List || object instanceof ListItem) {
            return object.toFirebaseObject()
        }
        return object
    },

    saveList (userId, list) {
        list = this.getFirebaseObject(list)

        if (!list.firebaseId) {
            return firestore.collection('users').doc(userId)
                .collection('lists')
                .add(this.getListData(list))
                .then(docRef => docRef.id)
                .catch(error => {
                    throw error
                })
        } else {
            return firestore.collection('users').doc(userId)
                .collection('lists').doc(list.firebaseId)
                .set(this.getListData(list))
                .then(() => true)
                .catch(error => {
                    throw error
                })
        }
    },

    getListItemData (listItem) {
        return {
            name: listItem.name,
            status: listItem.status,
            priority: listItem.priority || 0,
            modifiedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
    },

    saveListItem (userId, listId, listItem) {
        listItem = this.getFirebaseObject(listItem)

        if (!listItem.firebaseId) {
            return firestore.collection('users').doc(userId)
                .collection('lists').doc(listId)
                .collection('items')
                .add(this.getListItemData(listItem))
                .then(docRef => docRef.id)
                .catch(error => {
                    throw error
                })
        } else {
            return firestore.collection('users').doc(userId)
                .collection('lists').doc(listId)
                .collection('items').doc(listItem.firebaseId)
                .set(this.getListItemData(listItem))
                .then(() => true)
                .catch(error => {
                    throw error
                })
        }
    },

    async getItems (listId) {
        return firestore.getItems(listId)
    }

}
