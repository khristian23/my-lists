import Const from '@/util/constants'
import LocalStorage from './IndexedDB/storage-idb'
import FirebaseStorage from './Firestore/storage-fire'
import Firebase from 'firebase'

export default {

    getFirebaseUser () {
        return Firebase.auth().currentUser
    },

    async synchronize () {
        try {
            let user = await this.getFirebaseUser()
            if (user && !user.isAnonymous) {
                // Synchronize new local item to server
                await this.syncLocalListsToFirebase(user.uid)

                // Synchronize changed items to server
                await this.syncChangedListsToFirebase(user.uid)

                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    },

    async syncLocalListsToFirebase (userId) {
        let localLists = await LocalStorage.getLists(Const.user.anonymous)

        return Promise.all(localLists.map(async localList => {
            let remoteListId = await FirebaseStorage.saveList(userId, localList)
            let localItems = await LocalStorage.getListItems(Const.user.anonymous, localList.id)

            await Promise.all(localItems.map(async localItem => {
                let remoteItemId = await FirebaseStorage.saveListItem(userId, remoteListId, localItem)
                localItem.firebaseId = remoteItemId
                localItem.syncStatus = ''
            }))
            localList.firebaseId = remoteListId
            localList.syncStatus = ''
            await LocalStorage.saveListItems(userId, localItems)
            await LocalStorage.saveList(userId, localList)
        }))
    },

    async syncChangedListsToFirebase (userId) {
        let syncedLists = await LocalStorage.getLists(userId)
        syncedLists = syncedLists.filter(syncedList => !!syncedList.syncStatus)

        return Promise.all(syncedLists
            .map(async syncedList => {
                if (!syncedList.firebaseId) {
                    syncedList.firebaseId = await FirebaseStorage.saveList(userId, syncedList)
                }
                let syncedItems = await LocalStorage.getListItems(userId, syncedList.id)
                syncedItems = syncedItems.filter(syncedItem => !!syncedItem.syncStatus)

                await Promise.all(syncedItems
                    .map(async syncedItem => {
                        if (!syncedItem.firebaseId) {
                            syncedItem.firebaseId = await FirebaseStorage.saveListItem(userId, syncedList.firebaseId, syncedItem)
                        } else {
                            await FirebaseStorage.saveListItem(userId, syncedList.firebaseId, syncedItem)
                        }
                        syncedItem.syncStatus = ''
                    })
                )

                await LocalStorage.saveListItems(userId, syncedItems)
                await FirebaseStorage.saveList(userId, syncedList)
                syncedList.syncStatus = ''
                LocalStorage.saveList(userId, syncedList)
            })
        )
    }
}
