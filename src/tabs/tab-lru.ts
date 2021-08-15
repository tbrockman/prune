import LRU from '../data-structures/lru'
import { localStorageGetAsync, localStorageSetAsync } from '../util'

class TabLRU {

    lruKey: string
    lruSize: number
    destination: string
    openTabsMap: any
    lru: LRU

    constructor({ lruKey='tab-lru', lruSize=20, destination='group' }) {
        this.lruKey = lruKey
        this.lruSize = lruSize
        this.destination = destination
        this.openTabsMap = {}
        this.lru = new LRU(new Set(), this.lruSize)
    }

    async init(openTabs: any) {
        const raw = await localStorageGetAsync(this.lruKey)

        if (Object.keys(raw).length > 0) {
            this.lru = LRU.deserialize(raw[this.lruKey])
            // update capacity if it's changed since
            this.lru!.capacity = this.lruSize
        }

        openTabs.forEach((tab:any)=> {
            this.openTabsMap[tab.id] = tab
        })
        // remove tabs in lru which are no longer open
        this.lru.cache.forEach(tabId => {
            if (!(tabId in this.openTabsMap)) {
                this.lru.delete(tabId)
            }
        })
        const evictedIds = new Set()

        for (const [k, v] of Object.entries(this.openTabsMap)) {
            const tabId = parseInt(k)

            if (!(this.lru.has(tabId))) {
                const removed = this.lru.add(tabId)
                removed.forEach(id => evictedIds.add(id))
            }
        }
        // if there's something still in our lru that we planned to evict
        this.lru.cache.forEach(id => {
            evictedIds.delete(id)
        })
        let evicted: any[] = []
        evictedIds.forEach((id: any) => evicted.push(this.openTabsMap[id]))
        const serialized = this.lru.serialize()
        await localStorageSetAsync({[this.lruKey]: serialized})
        return evicted
    }

    async add(tabId: number) {
        let evicted: any[] = []
        const evictedIds = this.lru.add(tabId)
        evictedIds.forEach(id => evicted.push(this.openTabsMap[id]))
        const serialized = this.lru.serialize()
        await localStorageSetAsync({[this.lruKey]: serialized})
        return evicted
    }
}

export {
    TabLRU
}