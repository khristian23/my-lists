import ListObject from './ListObject'

class ListItem extends ListObject {
    constructor (data) {
        super(data)
        this._listId = data.listId
        this._id = data.id
        this._name = data.name
        this._priority = data.priority || 0
        this._modifiedAt = data.modifiedAt
        this._status = data.status
        this._syncStatus = data.syncStatus
        this._firebaseId = data.firebaseId
        this._user = data.user
    }

    get id () {
        return this._id
    }

    set id (id) {
        this._id = id
    }

    get name () {
        return this._name
    }

    set firebaseId (firebaseId) {
        this._firebaseId = firebaseId
    }

    get firebaseId () {
        return this._firebaseId
    }

    set localId (localId) {
        this._localId = localId
    }

    get localId () {
        return this._localId
    }

    set syncStatus (syncStatus) {
        this._syncStatus = syncStatus
    }

    get syncStatus () {
        return this._syncStatus
    }

    get modifiedAt () {
        return this._modifiedAt
    }

    set userId (userId) {
        this._userId = userId
    }

    toFirebaseObject () {
        let keys = ['id', 'name', 'priority', 'modifiedAt', 'status']
        return this._createObject(keys)
    }

    toObject () {
        let keys = ['id', 'name', 'priority', 'modifiedAt', 'status',
            'syncStatus', 'firebaseId', 'user']
        return this._createObject(keys)
    }
}

export default ListItem
