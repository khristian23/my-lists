var assert = require('assert')
import sync from '@/storage/Sync'

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})

describe('Synchronization', function () {
    describe('#test', function () {
        it('should run test synchronizatoion', async function () {
            const result = await sync.test()
            assert.equal(result, 'test')
        })
    })
})