import LocalStorage from './IndexedDB/storage-idb'
import FirebaseStorage from './Firestore/storage-fire'
import Firebase from 'firebase'
import Const from '@/util/constants'
import List from '@/storage/List'
import Profile from './Profile'

export default {

    getFirebaseUser () {
        return Firebase.auth().currentUser
    },

    async getLastSynchonizationTimeForUser (userId) {
        const profile = await LocalStorage.getProfile(userId)
        if (profile) {
            return profile.lastSyncTime
        } else {
            return 0
        }
    },

    async setLastSynchronizationTimeForUser (userId, syncTimestamp) {
        let profile = await LocalStorage.getProfile(userId)
        if (!profile) {
            profile = new Profile({ userId: userId })
        }
        profile.lastSyncTime = syncTimestamp
        return LocalStorage.saveProfile(userId, profile)
    },

    _createDistribution () {
        return {
            newLocal: [],
            changedLocal: [],
            deletedLocal: [],
            newServer: [],
            changedServer: [],
            deletedServer: []
        }
    },

    _distributeListObjectsByModificationDate (distribution, localObject, serverObject, lastSync) {
        function itWasModifiedAfterLastSync (listObject) {
            return listObject.modifiedAt >= lastSync
        }

        if (itWasModifiedAfterLastSync(localObject) && itWasModifiedAfterLastSync(serverObject)) {
            if (localObject.modifiedAt < serverObject.modifiedAt) {
                distribution.changedLocal.push(localObject)
            } else {
                distribution.changedServer.push(serverObject)
            }
        } else if (itWasModifiedAfterLastSync(localObject)) {
            distribution.changedLocal.push(localObject)

        } else if (itWasModifiedAfterLastSync(serverObject)) {
            distribution.changedServer.push(serverObject)
        }
    },


    computeListsToSync (localLists, serverLists, lastSync) {
        function isFlaggedAsDeleted (listObject) {
            return listObject.syncStatus === Const.changeStatus.deleted
        }
    
        function isNotSyncedToFirebaseYet (listObject) {
            return !listObject.firebaseId
        }

        function findCorrespondentServerObject (localObject) {
            return serverLists.filter(serverObject => serverObject.id === localObject.firebaseId)[0]
        }

        function findCorrespondentLocalObject (serverObject) {
            return localLists.filter(localObject => localObject.firebaseId === serverObject.id)[0]
        }

        function itWasModifiedAfterLastSync (listObject) {
            return listObject.modifiedAt >= lastSync
        }

        const distribution = this._createDistribution()

        localLists.forEach(localObject => {
            localObject.localId = localObject.id

            if (isFlaggedAsDeleted(localObject)) {
                distribution.deletedLocal.push(localObject)

            } else if (isNotSyncedToFirebaseYet(localObject)) {
                distribution.newLocal.push(localObject)

            } else {
                const serverObject = findCorrespondentServerObject(localObject)
                if (serverObject) {
                    serverObject.localId = localObject.id
                    this._distributeListObjectsByModificationDate(distribution, localObject, serverObject, lastSync)
                } else {
                    distribution.deletedServer.push(localObject)
                }
            }
        })

        serverLists.forEach(serverObject => {
            if (itWasModifiedAfterLastSync(serverObject) &&
                !findCorrespondentLocalObject(serverObject)) {
                
                serverObject.firebaseId = serverObject.id
                distribution.newServer.push(serverObject)
            }
        })

        const result = { lists: {}, items: {} }
        Object.keys(result).forEach(type => {
            result[type] = distribution
        })


        return result
    },

    _syncLocalListItemToFirebase (userId, firebaseListId, localListItems) {
        return Promise.all(localListItems.map(async localItem => {
            if (localItem.syncStatus === Const.changeStatus.deleted) {
                await FirebaseStorage.deleteListItem(userId, firebaseListId, localItem.firebaseId)
            } else {
                localItem.firebaseId = await FirebaseStorage.saveListItem(userId, firebaseListId, localItem)
            }
        }))
    },

    async _processLocalListAfterFirebaseSync (userId, localList) {
        if (localList.syncStatus === Const.changeStatus.deleted) {
            await LocalStorage.deleteList(userId, localList.id)
        } else {
            const itemsToDelete = []
            const itemsToSave = []

            localList.listItems.forEach(item => {
                if (item.syncStatus === Const.changeStatus.deleted) {
                    itemsToDelete.push(item)        
                } else {
                    item.syncStatus = Const.changeStatus.none
                    itemsToSave.push(item)
                }
            })

            localList.listItems = itemsToSave

            await Promise.all(itemsToDelete.map(async item => {
                return LocalStorage.deleteListItem(userId, item.id)
            }))

            localList.syncStatus = Const.changeStatus.none
            await LocalStorage.saveList(userId, localList)
        }
    },

    syncLocalListToFirebase (userId, localLists) {
        return Promise.all(localLists.map(async localList => {
            if (localList.syncStatus === Const.changeStatus.deleted) {
                await FirebaseStorage.deleteList(userId, localList.firebaseId)

            } else {
                localList.firebaseId  = await FirebaseStorage.saveList(userId, localList)
                await this._syncLocalListItemToFirebase(userId, localList.firebaseId, localList.listItems)
            }
            
            await this._processLocalListAfterFirebaseSync(userId, localList)
        }))
    },

    _adaptFirebaseObjectToLocalId (objectToAdapt) {
        objectToAdapt.firebaseId = objectToAdapt.id
        if (objectToAdapt.localId) {
            objectToAdapt.id = objectToAdapt.localId
        } else {
            objectToAdapt.id = undefined
        }
    },

    async syncFirebaseListToLocal (userId, firebaseLists) {
        return Promise.all(firebaseLists.map(async firebaseList => {
            firebaseList.listItems.forEach(item => this._adaptFirebaseObjectToLocalId(item))
            
            this._adaptFirebaseObjectToLocalId(firebaseList)
            await LocalStorage.saveList(userId, firebaseList)
        }))
    },

    async syncAnonymousLocalListsToFirebase (userId) {
        const localLists = await LocalStorage.getLists(Const.user.anonymous)
        await this.syncLocalListToFirebase(userId, localLists)
        return localLists.length
    },

    async syncLocalChangesWithFirebase (userId, computed) {
        return Promise.all([].concat(
            this.syncLocalListToFirebase(userId, computed.newLocal),
            this.syncLocalListToFirebase(userId, computed.changedLocal),
            this.syncFirebaseListToLocal(userId, computed.newServer),
            this.syncFirebaseListToLocal(userId, computed.changedServer)
        ))
    },

    async synchronize () {
        try {
            const user = await this.getFirebaseUser()
            if (user && !user.isAnonymous) {
                // Retrieve the last sync timestamp
                const lastSync = await this.getLastSynchonizationTimeForUser()

                // Record synchronization time after fetching data from server
                const currentSync = (new Date()).getTime()

                // Synchronize new local item to server
                let changesCount = await this.syncAnonymousLocalListsToFirebase(user.uid)

                // Retrieve local and remote lists
                const localLists = await LocalStorage.getLists(user.id)
                const serverLists = await FirebaseStorage.getLists(user.id)

                // Synchronize changed items to server
                const computedLists = this.computeListsToSync(localLists, serverLists, lastSync)
                await this.syncLocalChangesWithFirebase(user.uid, computedLists)
                changesCount += localLists.length + serverLists.length

                // Record the sync timestamp
                await this.setLastSynchronizationTime(user.uid, currentSync)

                if (changesCount > 0) {
                    return true
                }
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }
}
