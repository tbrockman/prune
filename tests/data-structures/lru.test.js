import LRU from '../../src/data-structures/lru'
import { assert } from 'chai';

describe('lru', () => {

    it('should store a single value', () => {
        const lru = new LRU()
        lru.add('a')
        assert.isTrue(lru.has('a'))
    })

    it('should evict keys once capacity reached', () => {
        const lru = new LRU(new Set(), 1)
        lru.add('a')
        lru.add('b')
        assert.isFalse(lru.has('a'))
        assert.isTrue(lru.has('b'))
    })

    it('should be serializable', () => {
        const lru = new LRU(new Set(), 3)
        lru.add('a')
        lru.add('b')
        lru.add('c')
        const string = lru.serialize()
        const same = LRU.deserialize(string)
        assert.isTrue(lru.has('a'))
        assert.isTrue(same.has('b'))
        assert.isTrue(same.has('c'))
    })

    it('should be serializable', () => {
        const lru = new LRU(new Set(), 3)
        lru.add('a')
        lru.add('b')
        lru.add('c')
        const string = lru.serialize()
        const same = LRU.deserialize(string)
        assert.isTrue(lru.has('a'))
        assert.isTrue(same.has('b'))
        assert.isTrue(same.has('c'))
    })
})