var assert = require('assert')
var sinon = require('sinon');

import sync from '@/storage/Sync'
import List from '@/storage/List'
import ListItem from '@/storage/ListItem'

describe('Synchronization', function () {
    describe('Sync Firebase and Local changes', function () {
      before(function () {
        this.currentDate =  new Date().getTime()
        
        for (let i = -6; i <= 5; i++) {
          let name = 'time' + (i < 0 ? 'Minus' + Math.abs(i) : (i > 0 ? 'Plus' + i : ''))
          this[name] = (new Date(this.currentDate + 1000*60*60*24*i)).getTime()
        }

        this.localLists = [
          new List({
            id: 1,
            modifiedAt: this.timeMinus6,
            itemModifiedAt: this.timePlus1,
            firebaseId: 101,
            listItems: [ 
              new ListItem({
                id: 11,
                name: 'local11',
                modifiedAt: this.timeMinus2,
                firebaseId: 1101
              }), 
              new ListItem({
                id: 12,
                modifiedAt: this.timePlus1
              })
            ]
          }),
          new List({
            id: 2,
            modifiedAt: this.timeMinus2,
            firebaseId: 102
          }),
          new List({
            id: 3,
            modifiedAt: this.timePlus3,
          }),
          new List({
            id: 4,
            modifiedAt: this.timePlus4,
            firebaseId: 104
          }),
          new List({
            id: 5,
            modifiedAt: this.timeMinus4
          })
        ],

        this.serverLists = [
          new List({
            id: 101,
            modifiedAt: this.timePlus2,
            listItems: [
              new ListItem({
                id: 1101,
                name: 'server1101',
                modifiedAt: this.timeMinus2
              }),
              new ListItem({
                id: 1201,
                modifiedAt: this.timePlus4
              })
            ]
          }),
          new List({
            id: 102,
            modifiedAt: this.timeMinus2
          }),
          new List({
            id: 103,
            modifiedAt: this.timePlus1
          }),
          new List({
            id: 104,
            modifiedAt: this.timeMinus4
          }),
          new List({
            id: 105,
            modifiedAt: this.time
          })
        ]

        let resultLists = sync.computeListsToSync(this.localLists, this.serverLists, this.timeMinus5)
        this.newLocal = resultLists.newLocal
        this.newServer = resultLists.newServer
        this.changedLocal = resultLists.changedLocal
        this.changedServer = resultLists.changedServer
      })

      function arrayShouldContainListWithId(lists, id, shouldBeFound) {
        let result = lists.some(list => list.id === id)
        if (shouldBeFound) {
          assert.ok(result, `ID: ${ id } is not found in list`)
        } else {
          assert.ok(!result, `ID: ${ id } is found in list`)
        }
      }

      it('should detect new local lists', function () {
        arrayShouldContainListWithId(this.newLocal, 1, false)
        arrayShouldContainListWithId(this.newLocal, 2, false)
        arrayShouldContainListWithId(this.newLocal, 3, true)
        arrayShouldContainListWithId(this.newLocal, 4, false)
        arrayShouldContainListWithId(this.newLocal, 5, true)
      })

      it('should detect new server side list', function () {
        arrayShouldContainListWithId(this.newServer, 101, false)
        arrayShouldContainListWithId(this.newServer, 102, false)
        arrayShouldContainListWithId(this.newServer, 103, true)
        arrayShouldContainListWithId(this.newServer, 104, false)
        arrayShouldContainListWithId(this.newServer, 105, true)
      })

      it('should take server side changes made before local list changes', function () {
        arrayShouldContainListWithId(this.changedServer, 101, true)
        arrayShouldContainListWithId(this.changedServer, 102, true)
        arrayShouldContainListWithId(this.changedServer, 104, true)

        assert.equal(this.changedServer[0].localId, 1)
        assert.equal(this.changedServer[1].localId, 2)
        assert.equal(this.changedServer[2].localId, 4)
      })

      it('should reject server side changes made after local list changes', function () {
        arrayShouldContainListWithId(this.changedLocal, 1, true)
        arrayShouldContainListWithId(this.changedLocal, 2, false)
        arrayShouldContainListWithId(this.changedLocal, 4, false)
      })

      it('should consider synchronize list items', function () {
        let localListItems = this.changedLocal[0].listItems
        arrayShouldContainListWithId(localListItems, 11, false)
        arrayShouldContainListWithId(localListItems, 12, true)

        let serverListItems = this.changedServer[0].listItems
        arrayShouldContainListWithId(serverListItems, 1101, true)
        arrayShouldContainListWithId(serverListItems, 1201, true)
      })

      it('should synchronize only modified lists', function () {
        let stubToFirebase = sinon.stub(sync, "syncLocalListToFirebase").returns(Promise.resolve(true))
        let stubToLocal = sinon.stub(sync, "syncFirebaseListToLocal").returns(Promise.resolve(true))

        sync.syncLocalChangesWithFirebase('user', this.localLists, this.serverLists, this.timeMinus5)

        let expectedToFirebase = this.localLists.filter(list => !list.firebaseId)
        assert.deepEqual(stubToFirebase.getCall(0).args[1], expectedToFirebase, 'Sync To Firebase full lists')
        assert.deepEqual(stubToFirebase.getCall(1).args[1], [ this.localLists[0] ], 'Sync To Firebase only items')

        let expectedToLocal = [].concat(
          this.serverLists.filter(list => list.id === 103 || list.id === 105),
          this.serverLists.filter(list => list.id !== 103 && list.id !== 105),
        )
        assert.deepEqual(stubToLocal.getCall(0).args[1], expectedToLocal, 'Sync To Local full lists')
        assert.deepEqual(stubToLocal.getCall(1).args[1], [], 'Sync To Local only items')

        stubToFirebase.restore()
        stubToLocal.restore()
      })
    })
})