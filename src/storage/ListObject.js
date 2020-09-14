class ListObject {
    _createObject (keys) {
        return keys.reduce((object, property) => {
            if (ListObject.prototype.hasOwnProperty.call(this, '_' + property)) {
                object[property] = typeof this['_' + property] === 'undefined' ? '' : this['_' + property]
            }
            return object
        }, {})
    }

    clone () {
        throw Error('Implement Clone method')
    }
}

export default ListObject
