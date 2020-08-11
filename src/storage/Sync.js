import LocalStorage from './IndexedDB/storage-idb'
import FirebaseStorage from './Firestore/storage-fire'
import Firebase from 'firebase'
import Const from '@/util/constants'
import List from '@/storage/List'

export default {

    getFirebaseUser () {
        return Firebase.auth().currentUser
    },

    async getLastSynchonizationTime (userId) {
        return LocalStorage.getLastSynchonizationTimeForUser(userId)
    },

    async setLastSynchronizationTime (userId, syncTimestamp) {
        LocalStorage.setLastSynchronizationTimeForUser(userId)
    },

    computeListsToSync (localLists, serverLists) {
        // Pair lists by remote ID and local FirebaseId
        let pairedLists = []
        let newLocalLists = []
        let newServerLists = []

        localLists.forEach(changedLocal => {
            if (!changedLocal.firebaseId) {
                // New Local List
                newLocalLists.push(changedLocal)
            } else {
                let found = serverLists.some(changedServer => {
                    if (changedLocal.firebaseId === changedServer.id) {
                        changedServer.localId = changedLocal.id
                        pairedLists.push({
                            local: changedLocal,
                            server: changedServer
                        })
                        return true
                    }
                    return false
                })
                if (!found) {
                    newLocalLists.push(changedLocal)
                }
            }
        })

        newServerLists = serverLists.filter(changedServer => {
            return !pairedLists.some(pairList => pairList.server.id === changedServer.id)
        })

        let changedLocal = []
        let changedServer = []

        // Check list Items
        pairedLists.forEach(pair => {
            let verifyList = true
            if (pair.local instanceof List) {
                let localListItems = pair.local.listItems
                let serverListItems = pair.server.listItems

                let result = this.computeListsToSync(localListItems, serverListItems)

                if (result.newLocal.length + result.changedLocal.length) {
                    pair.local.listItems = result.newLocal.concat(result.changedLocal)
                    changedLocal.push(pair.local)
                    verifyList = false
                }
                if (result.newServer.length + result.changedServer.length) {
                    pair.server.listItems = result.newServer.concat(result.changedServer)
                    changedServer.push(pair.server)
                    verifyList = false
                }
            }

            if (verifyList) {
                if (pair.local.modifiedAt < pair.server.modifiedAt) {
                    changedLocal.push(pair.local)
                } else {
                    changedServer.push(pair.server)
                }
            }
        })

        return {
            newLocal: newLocalLists,
            changedLocal: changedLocal,
            changedServer: changedServer,
            newServer: newServerLists
        }
    },

    syncLocalListToFirebase (userId, localLists, onlyItems) {
        return localLists.map(async localList => {
            let firebaseListId
            if (!onlyItems) {
                firebaseListId = await FirebaseStorage.saveList(userId, localList)
                localList.firebaseId = firebaseListId
                localList.syncStatus = Const.status.none
                await LocalStorage.saveList(userId, localList)
            } else {
                firebaseListId = localList.firebaseId
            }

            return Promise.all(localList.listItems.map(async localItem => {
                let firebaseItemId = await FirebaseStorage.saveListItem(userId, firebaseListId, localItem)
                localItem.firebaseId = firebaseItemId
                localItem.syncStatus = Const.status.none
                return LocalStorage.saveListItem(userId, localItem)
            }))
        })
    },

    adaptFirebaseObjectToLocalId (object) {
        object.firebaseId = object.id
        if (object.localId) {
            object.id = object.localId
        } else {
            object.id = undefined
        }
    },

    syncFirebaseListToLocal (userId, firebaseLists, onlyItems) {
        return firebaseLists.map(async firebaseList => {
            this.adaptFirebaseObjectToLocalId(firebaseList)

            let localListId
            if (!onlyItems) {
                localListId = await LocalStorage.saveList(userId, firebaseList)
            } else {
                localListId = firebaseList.id
            }

            return Promise.all(firebaseList.listItems.map(firebaseItem => {
                this.adaptFirebaseObjectToLocalId(firebaseItem)
                return LocalStorage.saveLocalItem(userId, localListId, firebaseItem)
            }))
        })
    },

    async syncAnonymousLocalListsToFirebase (userId) {
        let localLists = await LocalStorage.getLists(Const.user.anonymous)

        localLists.forEach(async list => {
            let listItems = await LocalStorage.getListItems(Const.user.anonymous, list.id)
            list.addListItems(listItems)
        })

        return this.syncLocalListToFirebase(userId, localLists)
    },

    async syncLocalChangesWithFirebase (userId, localLists, serverLists, lastSync) {
        let computed = this.computeListsToSync(localLists, serverLists)

        let localOnlyItems = []
        let localListAndItems = []
        computed.changedLocal.forEach(list => {
            if (list.modifiedAt < lastSync) {
                localOnlyItems.push(list)
            } else {
                localListAndItems.push(list)
            }
        })

        let serverOnlyItems = []
        let serverListAndItems = []
        computed.changedServer.filter(list => {
            if (list.modifiedAt < lastSync) {
                serverOnlyItems.push(list)
            } else {
                serverListAndItems.push(list)
            }
        })

        let allPromises = [].concat(
            this.syncLocalListToFirebase(userId, computed.newLocal.concat(localListAndItems)),
            this.syncLocalListToFirebase(userId, localOnlyItems, true),
            this.syncFirebaseListToLocal(userId, computed.newServer.concat(serverListAndItems)),
            this.syncFirebaseListToLocal(userId, serverOnlyItems, true)
        )

        return Promise.all(allPromises).then(results => {
            return results.reduce((result, value) => {
                result = result && value
                return result
            }, true)
        })
    },

    async synchronize () {
        try {
            let user = await this.getFirebaseUser()
            if (user && !user.isAnonymous) {
                // Retrieve the last sync timestamp
                let lastSync = await this.getLastSynchonizationTime()

                // Retrieve local and remote lists
                let localLists = await LocalStorage.getListsForSynchronization(user.id, lastSync)
                let serverLists = await FirebaseStorage.getListsForSynchronization(user.id, lastSync)

                // Record synchronization time after fetching data from server
                let currentSync = (new Date()).getTime()

                // Synchronize new local item to server
                await this.syncAnonymousLocalListsToFirebase(user.uid)

                // Synchronize changed items to server
                let success = await this.syncLocalChangesWithFirebase(user.uid, localLists, serverLists, lastSync)

                // Record the sync timestamp
                if (success) {
                    await this.setLastSynchronizationTime(user.uid, currentSync)
                }

                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }
}
