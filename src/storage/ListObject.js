class ListObject {
    _createObject (keys) {
        return keys.reduce((object, property) => {
            if (this.hasOwnProperty('_' + property)) {
                object[property] = typeof this['_' + property] === 'undefined' ? '' : this['_' + property]
            }
            return object
        }, {})
    }
}

export default ListObject
