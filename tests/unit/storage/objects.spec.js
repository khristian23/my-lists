const assert = require('assert')

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
                itemModifiedAt: timestamp,
                user: 'Christian'
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
                itemModifiedAt: timestamp,
                syncStatus: '',
                firebaseId: '',
                user: 'Christian'
            })
            
            assert.equal(actualObject, expectedObject)
        })
    })

    describe('ListItem Class', function () {
        it('should produce the right object for Firebase', function () {
            let timestamp = (new Date()).getTime()
            let listItem = new ListItem({
                id: 1001,
                name: 'to firebase name',
                modifiedAt: timestamp,
                status: 'Pending'
            })
            let actualFirebaseObject = JSON.stringify(listItem.toFirebaseObject())
            let expectedFirebaseObject = JSON.stringify({
                id: 1001,
                name: 'to firebase name',
                priority: 0,
                modifiedAt: timestamp,
                status: 'Pending'
            })
            
            assert.equal(actualFirebaseObject, expectedFirebaseObject)
        })

        it('should produce the right object for Local', function () {
            let timestamp = (new Date()).getTime()
            let listItem = new ListItem({
                id: 1001,
                name: 'to name',
                modifiedAt: timestamp,
                user: 'Christian',
                status: 'Done'
            })
            let actualObject = JSON.stringify(listItem.toObject())
            let expectedObject = JSON.stringify({
                id: 1001,
                name: 'to name',
                priority: 0,
                modifiedAt: timestamp,
                status: 'Done',
                syncStatus: '',
                firebaseId: '',
                user: 'Christian'
            })

            assert.equal(actualObject, expectedObject)
        })
    })
})