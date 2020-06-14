import firestore from './firestore'
import firebase from 'firebase'

export default {

    async _getUserDocument (userId) {
        return firestore.collection('users').doc(userId)
    },

    async getLists (userId) {
        // let userDocument = await this._getUserDocument(userId)
        // let listsCollection = userDocument.collection('lists')
        return new Promise(resolve => {
            firestore.collection('users').doc(userId)
                .collection('lists')
                .onSnapshot(snapshots => {
                    let lists = snapshots.docs.map(doc => {
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

    async saveList (userId, list) {
        firestore.collection('users').doc(userId)
            .collection('lists')
            .add({
                name: list.name,
                description: list.description,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
    },

    async onAddListItem (userId, listItem) {
        firestore.collection('users').doc(userId)
            .collection('list-items')
            .add({
                name: listItem.name,
                listId: listItem.listId,
                status: listItem.status,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
    },

    async getItems (listId) {
        return firestore.getItems(listId)
    }

}
