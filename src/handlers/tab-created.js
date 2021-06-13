import LRU from '../data-structures/lru'
import { localStorageGetAsync, localStorageSetAsync } from '../util/index.js'

class TabCreatedHandler {
    
    constructor(tracker, grouper, pruner, deduplicator, options) {
        this.tracker = tracker
        this.grouper = grouper
        this.pruner = pruner
        this.deduplicator = deduplicator
        this.deduplicate = options['auto-deduplicate']
        this.autoGroupName = options['auto-group-name']
        this.lruEnabled = options['tab-lru-enabled']
        this.lruDestination = options['tab-lru-destination']
        this.lruSize = options['tab-lru-size']
        this.lruKey = 'tab-lru'
    }

    async execute(tab) {
        let openTabs = await chrome.tabs.query({})
        await this.tracker.init(openTabs)
        await this.tracker.track(tab)
    
        if (this.deduplicate) {
            this.deduplicator.deduplicateTab(tab)
        }
    
        // TODO: this is incorrect if tab deduplicated
        if (this.lruEnabled) {
            const group = {
                title: this.autoGroupName,
                color: "yellow",
                collapsed: true
            }
            console.debug('open tabs to filter: ', openTabs)
            openTabs = openTabs.filter(tab => tab.groupId === -1)
            console.debug('open tabs post-filter:' , openTabs)
            const raw = await localStorageGetAsync(this.lruKey)
            let lru
    
            if (Object.keys(raw).length > 0) {
                lru = LRU.deserialize(raw[this.lruKey])
                // update capacity if it's changed since
                lru.capacity = this.lruSize
            }
            else {
                lru = new LRU(new Set(), this.lruSize)
            }

            console.debug('existing lru', lru.cache)

            const openTabsMap = {}
            openTabs.forEach(tab => {
                openTabsMap[tab.id] = tab
            })
            // remove tabs in lru which are no longer open
            lru.cache.forEach(tabId => {
                if (!(tabId in openTabsMap)) {
                    lru.delete(tabId)
                }
            })
            let evicted = []
    
            for (const [k, v] of Object.entries(openTabsMap)) {
                const tabId = parseInt(k)
    
                if (!(lru.has(tabId))) {
                    const removed = lru.add(tabId)
                    removed.forEach(id => {
                        evicted.push(openTabsMap[id])
                    })
                }
            }
            console.debug('evicting:', evicted)
    
            if (this.lruDestination === 'remove') {
                await this.pruner.pruneTabs(evicted)
            }
            else if (this.lruDestination === 'group') {
                await this.grouper.groupTabs(evicted, group)
            }
            //const evicted = lru.add(tab.id)
            const serialized = lru.serialize()
            await localStorageSetAsync({[this.lruKey]: serialized})
        }
    }
}

export default TabCreatedHandler