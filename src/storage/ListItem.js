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

    get listId () {
        return this._listId
    }

    set listId (listId) {
        this._listId = listId
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

    set priority (priority) {
        this._priority = priority
    }

    get priority () {
        return this._priority
    }

    set status (status) {
        this._status = status
    }

    get status () {
        return this._status
    }

    set syncStatus (syncStatus) {
        this._syncStatus = syncStatus
        this._modifiedAt = new Date().getTime()
    }

    get syncStatus () {
        return this._syncStatus
    }

    set modifiedAt (modifiedAt) {
        this._modifiedAt = modifiedAt
    }

    get modifiedAt () {
        return this._modifiedAt
    }

    get userId () {
        return this._userId
    }

    set userId (userId) {
        this._userId = userId
    }

    toFirebaseObject () {
        const keys = ['id', 'name', 'priority', 'modifiedAt', 'status']
        return this._createObject(keys)
    }

    toObject () {
        const keys = ['id', 'name', 'priority', 'modifiedAt', 'status',
            'syncStatus', 'firebaseId', 'user']
        return this._createObject(keys)
    }
}

export default ListItem
