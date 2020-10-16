import List from '@/storage/List'
import ListItem from '@/storage/ListItem'
import Profile from '@/storage/Profile'
import assert from 'assert'

describe('Objects', function () {
    describe('List Class', function () {
        it('should produce a new object for Firebase', function () {
            let timestamp = (new Date()).getTime()
            let list = new List({
                id: 1001,
                name: 'to firebase name',
                description: 'to firebase description',
                type: 'my Type',
                subtype: 'my Subtype',
                modifiedAt: timestamp,
            })
            let actualFirebaseObject = JSON.stringify(list.toFirebaseObject())
            let expectedFirebaseObject = JSON.stringify({
                name: 'to firebase name',
                description: 'to firebase description',
                priority: 0,
                type: 'my Type',
                subtype: 'my Subtype',
                modifiedAt: timestamp,
            })
            
            assert.deepStrictEqual(actualFirebaseObject, expectedFirebaseObject)
        })

        it('should produce an existent object for Firebase', function () {
            let timestamp = (new Date()).getTime()
            let list = new List({
                id: 1001,
                firebaseId: 9992,
                name: 'to firebase name',
                description: 'to firebase description',
                type: 'my Type',
                subtype: 'my Subtype',
                modifiedAt: timestamp,
            })
            let actualFirebaseObject = JSON.stringify(list.toFirebaseObject())
            let expectedFirebaseObject = JSON.stringify({
                id: 9992,
                name: 'to firebase name',
                description: 'to firebase description',
                priority: 0,
                type: 'my Type',
                subtype: 'my Subtype',
                modifiedAt: timestamp,
            })
            
            assert.deepStrictEqual(actualFirebaseObject, expectedFirebaseObject)
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
                userId: 'Christian'
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
                syncStatus: '',
                firebaseId: '',
                userId: 'Christian'
            })
            
            assert.deepStrictEqual(actualObject, expectedObject)
        })
    })

    describe('ListItem Class', function () {
        it('should produce the right new object for Firebase', function () {
            let timestamp = (new Date()).getTime()
            let listItem = new ListItem({
                id: 1001,
                name: 'to firebase name',
                modifiedAt: timestamp,
                status: 'Pending'
            })
            let actualFirebaseObject = JSON.stringify(listItem.toFirebaseObject())
            let expectedFirebaseObject = JSON.stringify({
                name: 'to firebase name',
                priority: 0,
                modifiedAt: timestamp,
                status: 'Pending'
            })
            
            assert.deepStrictEqual(actualFirebaseObject, expectedFirebaseObject)
        })

        it('should produce the right existent object for Firebase', function () {
            let timestamp = (new Date()).getTime()
            let listItem = new ListItem({
                id: 1001,
                firebaseId: 9999,
                name: 'to firebase name',
                modifiedAt: timestamp,
                status: 'Pending'
            })
            let actualFirebaseObject = JSON.stringify(listItem.toFirebaseObject())
            let expectedFirebaseObject = JSON.stringify({
                id: 9999,
                name: 'to firebase name',
                priority: 0,
                modifiedAt: timestamp,
                status: 'Pending'
            })
            
            assert.deepStrictEqual(actualFirebaseObject, expectedFirebaseObject)
        })

        it('should produce the right object for Local', function () {
            let timestamp = (new Date()).getTime()
            let listItem = new ListItem({
                id: 1001,
                listId: 250,
                name: 'to name',
                modifiedAt: timestamp,
                userId: 'Christian',
                status: 'Done'
            })
            let actualObject = JSON.stringify(listItem.toObject())
            let expectedObject = JSON.stringify({
                id: 1001,
                listId: 250,
                name: 'to name',
                priority: 0,
                modifiedAt: timestamp,
                status: 'Done',
                syncStatus: '',
                firebaseId: '',
                userId: 'Christian'
            })

            assert.deepStrictEqual(actualObject, expectedObject)
        })
    })

    describe('Profile Class', function () {
        it('should produce the right object for Local', function () {
            let timestamp = (new Date()).getTime()
            let profile = new Profile({
                name: 'to name',
                email: 'the_email@sap.com',
                lastSyncTime: timestamp,
                userId: 'Christian'
            })
            let actualObject = JSON.stringify(profile.toObject())
            let expectedObject = JSON.stringify({
                userId: 'Christian',
                name: 'to name',
                email: 'the_email@sap.com',
                lastSyncTime: timestamp
            })

            assert.deepStrictEqual(actualObject, expectedObject)
        })
    })
})