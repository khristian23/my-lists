import { model } from './db-model'

const DB_NAME = 'my-lists'
const DB_VERSION = 1
let DB

export default {

    async getDb () {
        return new Promise((resolve, reject) => {
            if (DB) {
                return resolve(DB)
            }
            let request = window.indexedDB.open(DB_NAME, DB_VERSION)

            request.onerror = e => {
                reject(e)
            }

            request.onsuccess = e => {
                DB = e.target.result
                resolve(DB)
            }

            request.onupgradeneeded = e => {
                let db = e.target.result
                let tables = model.tables

                Object.keys(tables).forEach(t => {
                    var store = db.createObjectStore(t, tables[t].config)
                    tables[t].indexes.forEach(i => {
                        store.createIndex(i, i, { unique: false })
                    })
                })
            }
        })
    },

    async getObjects (table) {
        let db = await this.getDb()

        return new Promise(resolve => {
            let trans = db.transaction([table], 'readonly')

            trans.oncomplete = () => {
                resolve(objects)
            }

            let store = trans.objectStore(table)
            let objects = []

            store.openCursor().onsuccess = e => {
                let cursor = e.target.result
                if (cursor) {
                    objects.push(cursor.value)
                    cursor.continue()
                }
            }
        })
    },

    async getObjectsBy (table, options) {
        let db = await this.getDb()

        if (!options) {
            return this.getObjects()
        }

        return new Promise(resolve => {
            let trans = db.transaction([table], 'readonly')
            let store = trans.objectStore(table)

            let field = Object.keys(options)[0]
            let value = options[field]

            if (field === store.keyPath) {
                let request = store.get(parseInt(value, 10))
                request.onsuccess = () => {
                    resolve(request.result)
                }
            } else {
                let range = IDBKeyRange.lowerBound(value)
                let objects = []
                let index = store.index(field)

                trans.oncomplete = () => {
                    resolve(objects)
                }

                index.openCursor(range).onsuccess = e => {
                    let cursor = e.target.result
                    if (cursor) {
                        objects.push(cursor.value)
                        cursor.continue()
                    }
                }
            }
        })
    },

    async addObject (table, object) {
        let db = await this.getDb()

        return new Promise(resolve => {
            let trans = db.transaction([table], 'readwrite')
            trans.oncomplete = () => {
                resolve()
            }

            let store = trans.objectStore(table)
            store.add(object)
        })
    },

    async updateObject (table, object) {
        let db = await this.getDb()

        return new Promise((resolve, reject) => {
            let trans = db.transaction([table], 'readwrite')
            let store = trans.objectStore(table)
            let request = store.get(object[store.keyPath])

            request.onsuccess = () => {
                let data = Object.assign({}, request.result, object)
                let updateRequest = store.put(data)
                updateRequest.onsuccess = () => {
                    resolve()
                }
                updateRequest.onerror = (e) => {
                    reject(e)
                }
            }
            request.onerror = (e) => {
                reject(e)
            }
        })
    },

    async deleteObject (table, object) {
        let db = await this.getDb()

        return new Promise((resolve, reject) => {
            let trans = db.transaction([table], 'readwrite')
            trans.oncomplete = () => {
                resolve()
            }
            trans.onerror = (e) => {
                reject(e)
            }

            let store = trans.objectStore(table)
            store.delete(object.id)
        })
    }
}
