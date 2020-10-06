import { model } from '@/storage/IndexedDB/db-model'
import idb from '@/storage/IndexedDB/indexed-db'
import assert from 'assert'
import { assertThrowsAsync } from '../util/helpers'

describe('IDB Model', () => {
    const USER_ID = 'Test'

    it('should throw exception when adding object to non-existent table', async () => {
        await assertThrowsAsync( async () => {
            await idb.addObject('non-existent-table', { id: 123 })
        })
    })

    it('should create an entry for each table', (done) => {
        const tables = Object.keys(model.tables)

        Promise.all(tables.map(tableName => {
            const definition = model.tables[tableName]
            const fields = definition.indexes

            const object = fields.reduce((result, field) => {
                result[field] = field
                return result
            }, {})

            object.userId = USER_ID
            
            return idb.addObject(tableName, object)
        }))
        .then(() => {
            return Promise.all(tables.map(tableName => { 
                return idb.getObjectsBy(tableName, { userId: USER_ID })
                    .then(objects => {
                        const savedObject = objects[0]
                        assert.strictEqual(savedObject.userId, USER_ID, `entry found for ${tableName}`)
                        assert.ok(Object.keys(savedObject).length > 1, 'Fields for indexes exist')
                        return savedObject
                    })
            }))
        })
        .then(() => {
            done() 
        })
    })

    it('should delete created entries', (done) => {
        const tables = Object.keys(model.tables)

        Promise.all(tables.map(tableName => {
            return idb.deleteObjectsBy(tableName, { userId: USER_ID })
        }))
        .then(() => {
            return Promise.all(tables.map(tableName => {
                return idb.getObjectsBy(tableName, { userId: USER_ID })
                    .then(deletedObject => {
                        assert.ok(!deletedObject[0])
                    })
            }))
        })
        .then(() => {
            done()
        })
    })
}).timeout(5000)