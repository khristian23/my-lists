import ListObject from './ListObject'

class List extends ListObject {
    constructor (data) {
        super(data)
        this._id = data.id
        this._name = data.name
        this._description = data.description
        this._priority = data.priority || 0
        this._type = data.type
        this._subtype = data.subtype
        this._user = data.user
        this._modifiedAt = data.modifiedAt
        this._itemModifiedAt = data.itemModifiedAt
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

    get modifiedAt () {
        return this._modifiedAt
    }

    get itemModifiedAt () {
        return this._itemModifiedAt
    }

    set itemModifiedAt (itemModifiedAt) {
        this._itemModifiedAt = itemModifiedAt
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

    _createObject (keys) {
        return keys.reduce((object, property) => {
            if (this.hasOwnProperty('_' + property)) {
                object[property] = typeof this['_' + property] === 'undefined' ? '' : this['_' + property]
            }
            return object
        }, {})
    }

    toFirebaseObject () {
        let keys = ['id', 'name', 'description', 'priority', 'type', 'subtype', 'modifiedAt',
            'itemModifiedAt']
        return this._createObject(keys)
    }

    toObject () {
        let keys = ['id', 'name', 'description', 'priority', 'type', 'subtype', 'modifiedAt',
            'itemModifiedAt', 'syncStatus', 'firebaseId', 'user']
        return this._createObject(keys)
    }
}

export default List
