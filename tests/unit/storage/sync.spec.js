import assert from 'assert'
import sinon from 'sinon'

import sync from '@/storage/Sync'
import List from '@/storage/List'
import ListItem from '@/storage/ListItem'
import Profile from '@/storage/Profile'
import Consts from '@/util/constants'

import LocalStorage from '@/storage/IndexedDB/storage-idb'
import IndexedDB from '@/storage/IndexedDB/indexed-db'
import FirebaseStorage from '@/storage/Firestore/storage-fire'

const USER_ID = 'Christian'

describe('Synchronization', () => {
  const context = {}

  let firebaseSaveListStub
  let firebaseSaveListItemStub
  let firebaseGetListStub

  let idbGetObjectsByStub

  let localSaveListStub
  let localSaveListItemStub

  before(() => {
    firebaseSaveListStub = sinon.stub(FirebaseStorage, 'saveList').returns(Promise.resolve(true))
    firebaseSaveListItemStub = sinon.stub(FirebaseStorage, 'saveListItem').returns(Promise.resolve(true))
    //firebaseGetListStub = sinon.stub(FirebaseStorage, 'getList').returns(Promise.resolve(true))

    idbGetObjectsByStub = sinon.stub(IndexedDB, 'getObjectsBy').returns([])

    localSaveListStub = sinon.stub(LocalStorage, 'saveList').returns(Promise.resolve(true))
    localSaveListItemStub = sinon.stub(LocalStorage, 'saveListItem').returns(Promise.resolve(true))

    context.currentDate =  new Date().getTime()
    
    for (let i = -6; i <= 5; i++) {
      let name = 'time' + (i < 0 ? 'Minus' + Math.abs(i) : (i > 0 ? 'Plus' + i : ''))
      context[name] = (new Date(context.currentDate + 1000*60*60*24*i)).getTime()
    }

    context.localLists = [
      new List({
        id: 1,
        modifiedAt: context.timeMinus6,
        itemModifiedAt: context.timePlus1,
        firebaseId: 101,
        listItems: [ 
          new ListItem({
            id: 11,
            name: 'local11',
            modifiedAt: context.timeMinus2,
            firebaseId: 1101
          }), 
          new ListItem({
            id: 12,
            modifiedAt: context.timePlus1
          })
        ]
      }),
      new List({
        id: 2,
        modifiedAt: context.timeMinus2,
        firebaseId: 102
      }),
      new List({
        id: 3,
        modifiedAt: context.timePlus3,
      }),
      new List({
        id: 4,
        modifiedAt: context.timePlus4,
        firebaseId: 104
      }),
      new List({
        id: 5,
        modifiedAt: context.timeMinus4
      })
    ],

    context.serverLists = [
      new List({
        id: 101,
        modifiedAt: context.timePlus2,
        listItems: [
          new ListItem({
            id: 1101,
            name: 'server1101',
            modifiedAt: context.timeMinus2
          }),
          new ListItem({
            id: 1201,
            modifiedAt: context.timePlus4
          })
        ]
      }),
      new List({
        id: 102,
        modifiedAt: context.timeMinus2
      }),
      new List({
        id: 103,
        modifiedAt: context.timePlus1
      }),
      new List({
        id: 104,
        modifiedAt: context.timeMinus4
      }),
      new List({
        id: 105,
        modifiedAt: context.time
      })
    ]

    let resultLists = sync.computeListsToSync(context.localLists, context.serverLists, context.timeMinus5)
    context.newLocal = resultLists.newLocal
    context.newServer = resultLists.newServer
    context.changedLocal = resultLists.changedLocal
    context.changedServer = resultLists.changedServer
  })

  after(() => {
    firebaseSaveListStub.restore()
    firebaseSaveListItemStub.restore()
    //firebaseGetListStub.restore()

    idbGetObjectsByStub.restore()

    localSaveListStub.restore()
    localSaveListItemStub.restore()
  })

  function arrayShouldContainListWithId(lists, id, shouldBeFound) {
    let result = lists.some(list => list.id === id)
    if (shouldBeFound) {
      assert.ok(result, `ID: ${ id } is not found in list`)
    } else {
      assert.ok(!result, `ID: ${ id } is found in list`)
    }
  }

  it('should get the last local synchronization time from existent user', async () => {
    idbGetObjectsByStub.reset()

    const currentTime = new Date().getTime()
    idbGetObjectsByStub.returns([{ userId: USER_ID, lastSyncTime: currentTime }])

    const lastSync = await sync.getLastSynchonizationTimeForUser(USER_ID)

    assert.strictEqual(lastSync, currentTime)
  })

  it('should get the last local synchronization time from non-existent user', async () => {
    idbGetObjectsByStub.reset()
    idbGetObjectsByStub.returns([])

    const lastSync = await sync.getLastSynchonizationTimeForUser(USER_ID)

    assert.strictEqual(lastSync, 0)
  })

  it('should set the last local synchronization time for existent user', async () => {
    const profile = new Profile({ userId: USER_ID, lastSyncTime: null })
    const expectedProfile = profile.toObject()
    const currentTime = new Date().getTime()
    expectedProfile.lastSyncTime = currentTime

    const getProfileStub = sinon.stub(LocalStorage, 'getProfile')
      .returns(Promise.resolve(profile))
    const saveProfileStub = sinon.stub(LocalStorage, 'saveProfile')
      .returns(Promise.resolve(true))

    await sync.setLastSynchronizationTimeForUser(USER_ID, currentTime)

    const actualProfile = saveProfileStub.lastCall.lastArg
    assert.ok(saveProfileStub.calledOnceWith(USER_ID))
    assert.deepStrictEqual(actualProfile.toObject(), expectedProfile)

    getProfileStub.restore()
    saveProfileStub.restore()
  })

  it('should set the last local synchronization time for non-existent user', async () => {
    const currentTime = new Date().getTime()
    const expectedProfile = new Profile({ userId: USER_ID, lastSyncTime: null }).toObject()
    expectedProfile.lastSyncTime = currentTime

    const getProfileStub = sinon.stub(LocalStorage, 'getProfile')
      .returns(Promise.resolve(undefined))
    const saveProfileStub = sinon.stub(LocalStorage, 'saveProfile')
      .returns(Promise.resolve(true))

    await sync.setLastSynchronizationTimeForUser(USER_ID, currentTime)

    const actualProfile = saveProfileStub.lastCall.lastArg
    assert.ok(saveProfileStub.calledOnceWith(USER_ID))
    assert.deepStrictEqual(actualProfile.toObject(), expectedProfile)
    
    getProfileStub.restore()
    saveProfileStub.restore()
  })

  it('should return the number of synchronized anonymous lists', async () => {
    const lists = [new List({}), new List({}), new List({})]

    const getLocalListsStub = sinon.stub(LocalStorage, 'getLists')
      .returns(Promise.resolve(lists))

    const count = await sync.syncAnonymousLocalListsToFirebase(USER_ID, lists)

    assert.ok(count, lists.length)

    getLocalListsStub.restore()
  })
  
  it('should synchronize new local list to firebase', async () => {
    const fakeFirebaseId = 1000

    firebaseSaveListStub.reset()
    firebaseSaveListStub
      .onFirstCall().returns(Promise.resolve(fakeFirebaseId + 1))
      .onSecondCall().returns(Promise.resolve(fakeFirebaseId + 2))

    firebaseSaveListItemStub.reset()
    firebaseSaveListItemStub
      .onFirstCall().returns(Promise.resolve(fakeFirebaseId + 100))
      .onSecondCall().returns(Promise.resolve(fakeFirebaseId + 200))

    localSaveListStub.reset()
    localSaveListItemStub.reset()

    const localLists = [ 
      new List({ id: 100, 
        syncStatus: Consts.changeStatus.new,
        modifiedAt: context.timeMinus2,
        listItems: [ 
          new ListItem({ id: 101, syncStatus: Consts.changeStatus.new }),
          new ListItem({ id: 102, syncStatus: Consts.changeStatus.new })
        ]
      }),
      new List({ id: 200,
        syncStatus: Consts.changeStatus.new,
        modifiedAt: context.timeMinus3,
        listItems: []
      })
      /*new List({ id: 200, 
        syncStatus: Consts.changeStatus.changed,
        firebaseId: 2000,
        modifiedAt: context.timeMinus2,
        itemModifiedAt: context.timeMinus3,
        localLists: [ 
          new ListItem({ id: 201, syncStatus: Consts.changeStatus.new }),
          new ListItem({ id: 202, firebaseId: 20 02, syncStatus: Consts.changeStatus.changed }),
          new ListItem({ id: 203, firebaseId: 2003, syncStatus: Consts.changeStatus.deleted })
        ]
      }),
      new List({ id: 200, 
        syncStatus: Consts.changeStatus.deleted,
        firebaseId: 3000,
        modifiedAt: context.timeMinus1,
        localLists: [ 
          new ListItem({ id: 3001, syncStatus: Consts.changeStatus.deleted }),
          new ListItem({ id: 3002, firebaseId: 2002, syncStatus: Consts.changeStatus.deleted }),
          new ListItem({ id: 3003, firebaseId: 2003, syncStatus: Consts.changeStatus.deleted })
        ]
      })*/
    ]

    let onyItems = false
    await sync.syncLocalListToFirebase(USER_ID, localLists, onyItems)

    assert.strictEqual(firebaseSaveListStub.callCount, 2, 'Firebase Save List called twice')
    assert.strictEqual(firebaseSaveListItemStub.callCount, 2, 'Firebase Save List Item called twice')
    assert.strictEqual(localSaveListStub.callCount, 2, 'Local Save List must be called twice')

    assert.strictEqual(firebaseSaveListItemStub.firstCall.args[1], fakeFirebaseId + 1, 'Should take first list firebase Id')
    assert.strictEqual(firebaseSaveListItemStub.secondCall.args[1], fakeFirebaseId + 1, 'Should take second list firebase Id')
    
    const firstLocalList = localSaveListStub.getCalls().filter(call => call.args[1].id === 100)[0].args[1]
    assert.strictEqual(firstLocalList.firebaseId, fakeFirebaseId + 1)
    assert.strictEqual(firstLocalList.syncStatus, Consts.changeStatus.none, 'Reset change flag for list')
    assert.strictEqual(firstLocalList.modifiedAt, context.timeMinus2, 'Modification timestamp kept')
    assert.ok(firstLocalList.listItems.every(item => item.syncStatus === Consts.changeStatus.none), 'Reset change list Item flag')
    assert.ok(firstLocalList.listItems.every(item => item.firebaseId > 0), 'Assign firebase Item id')


    // assert for changed items
    //    date modified must be stored at server side
    //    firebase Id should not be changed
    //    new item should have firebase id assigned
    //    modified item should not change it firebase id
    //    deleted item should be deleted
    //    on success clear the local syncStatus and timestamps
    //    and save synchronization to local storage 
    // assert for deleted items
    //    list and items must be deleted
    //    on success delete list and items from local storage
    // Method should return true or false in case of success
  })
  // syncLocalListToFirebase
  // syncFirebaseListToLocal

  it('should synchronize changed local list to firebase')

  it('should synchronize deleted local list to firebase')

  it('should return false if any local list synchronization error occurred')

  it('should synchronize local list to firebase')

  it('should detect new local lists', () => {
    arrayShouldContainListWithId(context.newLocal, 1, false)
    arrayShouldContainListWithId(context.newLocal, 2, false)
    arrayShouldContainListWithId(context.newLocal, 3, true)
    arrayShouldContainListWithId(context.newLocal, 4, false)
    arrayShouldContainListWithId(context.newLocal, 5, true)
  })

  it('should detect new server side list', () => {
    arrayShouldContainListWithId(context.newServer, 101, false)
    arrayShouldContainListWithId(context.newServer, 102, false)
    arrayShouldContainListWithId(context.newServer, 103, true)
    arrayShouldContainListWithId(context.newServer, 104, false)
    arrayShouldContainListWithId(context.newServer, 105, true)
  })

  it('should take server side changes made before local list changes', () => {
    arrayShouldContainListWithId(context.changedServer, 101, true)
    arrayShouldContainListWithId(context.changedServer, 102, true)
    arrayShouldContainListWithId(context.changedServer, 104, true)

    assert.equal(context.changedServer[0].localId, 1)
    assert.equal(context.changedServer[1].localId, 2)
    assert.equal(context.changedServer[2].localId, 4)
  })

  it('should reject server side changes made after local list changes', () => {
    arrayShouldContainListWithId(context.changedLocal, 1, true)
    arrayShouldContainListWithId(context.changedLocal, 2, false)
    arrayShouldContainListWithId(context.changedLocal, 4, false)
  })

  it('should consider synchronize list items', () => {
    let localListItems = context.changedLocal[0].listItems
    arrayShouldContainListWithId(localListItems, 11, false)
    arrayShouldContainListWithId(localListItems, 12, true)

    let serverListItems = context.changedServer[0].listItems
    arrayShouldContainListWithId(serverListItems, 1101, true)
    arrayShouldContainListWithId(serverListItems, 1201, true)
  })

  it('should synchronize only modified lists', () => {
    let stubToFirebase = sinon.stub(sync, "syncLocalListToFirebase").returns(Promise.resolve(true))
    let stubToLocal = sinon.stub(sync, "syncFirebaseListToLocal").returns(Promise.resolve(true))

    sync.syncLocalChangesWithFirebase('user', context.localLists, context.serverLists, context.timeMinus5)

    let expectedToFirebase = context.localLists.filter(list => !list.firebaseId)
    assert.deepEqual(stubToFirebase.getCall(0).args[1], expectedToFirebase, 'Sync To Firebase full lists')
    assert.deepEqual(stubToFirebase.getCall(1).args[1], [ context.localLists[0] ], 'Sync To Firebase only items')

    let expectedToLocal = [].concat(
      context.serverLists.filter(list => list.id === 103 || list.id === 105),
      context.serverLists.filter(list => list.id !== 103 && list.id !== 105),
    )
    assert.deepEqual(stubToLocal.getCall(0).args[1], expectedToLocal, 'Sync To Local full lists')
    assert.deepEqual(stubToLocal.getCall(1).args[1], [], 'Sync To Local only items')

    stubToFirebase.restore()
    stubToLocal.restore()
  })
})