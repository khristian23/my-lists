class ListItem {
    constructor (data) {
        this._listId = data.listId
        this._id = data.id
        this._name = data.name
        this._priority = data.priority
        this._modifiedAt = data.modifiedAt
        this._status = data.status
        this._firebaseId = data.firebaseId
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
        return Object.keys(this).reduce((object, property) => {
            if (this.hasOwnProperty(property) && property.substr(0, 1) !== '_') {
                object[property] = this[property]
            }
            return object
        }, {})
    }

    toObject () {
        return Object.keys(this).reduce((object, property) => {
            let fixedProperty = property.substr(1)
            if (this.hasOwnProperty(fixedProperty)) {
                object[fixedProperty] = this[property]
            }
            return object
        }, {})
    }
}

export default ListItem
