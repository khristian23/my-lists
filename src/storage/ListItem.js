import ListObject from './ListObject'
import Consts from '@/util/constants'

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
        this._userId = data.userId
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

    set name (name) {
        this._name = name
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

    flagAsNew () {
        this._syncStatus = Consts.changeStatus.new
        this._modifiedAt = new Date().getTime()
    }

    flagAsModified () {
        this._syncStatus = Consts.changeStatus.changed
        this._modifiedAt = new Date().getTime()
    }

    toFirebaseObject () {
        const keys = ['id', 'name', 'priority', 'modifiedAt', 'status']
        return this._createObject(keys)
    }

    toObject () {
        const keys = ['id', 'name', 'priority', 'modifiedAt', 'status',
            'syncStatus', 'firebaseId', 'userId']
        return this._createObject(keys)
    }

    clone () {
        return new ListItem(this.toObject())
    }
}

export default ListItem
