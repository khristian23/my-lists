import ListObject from './ListObject'
import Consts from '@/util/constants'

class List extends ListObject {
    constructor (data) {
        super(data)
        this._id = data.id
        this._name = data.name
        this._description = data.description
        this._priority = data.priority || 0
        this._type = data.type
        this._subtype = data.subtype
        this._userId = data.userId
        this._modifiedAt = data.modifiedAt
        this._syncStatus = data.syncStatus
        this._firebaseId = data.firebaseId
        this._listItems = data.listItems || []
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

    set name (name) {
        this._name = name
    }

    get description () {
        return this._description
    }

    set description (description) {
        this._description = description
    }

    get type () {
        return this._type
    }

    set type (type) {
        this._type = type
    }

    get subtype () {
        return this._subtype
    }

    set subtype (subtype) {
        this._subtype = subtype
    }

    set listItems (listItems) {
        this._listItems = listItems
    }

    get listItems () {
        return this._listItems
    }

    get firebaseId () {
        return this._firebaseId
    }

    set firebaseId (firebaseId) {
        this._firebaseId = firebaseId
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

    set modifiedAt (modifiedAt) {
        this._modifiedAt = modifiedAt
    }

    get modifiedAt () {
        return this._modifiedAt
    }

    set userId (userId) {
        this._userId = userId
    }

    get userId () {
        return this._userId
    }

    addListItems (listItems) {
        listItems.forEach(item => this.addListItem(item))
    }

    addListItem (listItem) {
        listItem.listId = this._id
        this._listItems.push(listItem)
    }

    flagAsNew () {
        this._syncStatus = Consts.changeStatus.new
        this._modifiedAt = new Date().getTime()
    }

    flagAsModified () {
        this._syncStatus = Consts.changeStatus.changed
        this._modifiedAt = new Date().getTime()
    }

    flagAsDeleted () {
        this._syncStatus = Consts.changeStatus.deleted
        this._modifiedAt = new Date().getTime()
    }

    toFirebaseObject () {
        const keys = ['id', 'name', 'description', 'priority', 'type', 'subtype', 'modifiedAt']
        const firebaseObject = this._createObject(keys)
        firebaseObject.id = this._firebaseId
        return firebaseObject
    }

    toObject () {
        const keys = ['id', 'name', 'description', 'priority', 'type', 'subtype', 'modifiedAt',
            'syncStatus', 'firebaseId', 'userId']
        return this._createObject(keys)
    }

    clone () {
        const listClone = new List(this.toObject())
        listClone.listItems = this.listItems.map(item => item.clone())
        return listClone
    }
}

export default List
