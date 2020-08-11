var assert = require('assert')

import List from '@/storage/List'
import ListItem from '@/storage/ListItem'

describe('Objects', function () {
    describe('List Class', function () {
        it('should produce the right object for Firebase', function () {
            let timestamp = (new Date()).getTime()
            let list = new List({
                id: 1001,
                name: 'to firebase name',
                description: 'to firebase description',
                type: 'my Type',
                subtype: 'my Subtype',
                modifiedAt: timestamp,
                itemModifiedAt: timestamp
            })
            let actualFirebaseObject = JSON.stringify(list.toFirebaseObject())
            let expectedFirebaseObject = JSON.stringify({
                id: 1001,
                name: 'to firebase name',
                description: 'to firebase description',
                priority: 0,
                type: 'my Type',
                subtype: 'my Subtype',
                modifiedAt: timestamp,
                itemModifiedAt: timestamp
            })
            
            assert.equal(actualFirebaseObject, expectedFirebaseObject)
        })

        it('should produce the right object for Local', function () {
            let timestamp = (new Date()).getTime()
            let list = new List({
                id: 1001,
                name: 'to name',
                description: 'to description',
                type: 'my Type',
                subtype: 'my Subtype',
                modifiedAt: timestamp,
                itemModifiedAt: timestamp
            })
            let actualObject = JSON.stringify(list.toObject())
            let expectedObject = JSON.stringify({
                id: 1001,
                name: 'to name',
                description: 'to description',
                priority: 0,
                type: 'my Type',
                subtype: 'my Subtype',
                modifiedAt: timestamp,
                itemModifiedAt: timestamp
            })
            
            assert.equal(actualObject, expectedObject)
        })
    })

    describe('ListItem Class', function () {
        it('should produce the right object for Firebase', function () {

        })

        it('should produce the right object for Local', function () {

        })
    })
})