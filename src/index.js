import { TabTracker, TabPruner, TabDeduplicator, TabGrouper, TabBookmarker } from './tabs/index.js'
import LRU from './data-structures/lru'
import { getOptionsAsync } from './options/index.js'
import { localStorageGetAsync, localStorageSetAsync } from './util/index.js'

const lock = new Set()
const toOneDayInMilliseconds = 24 * 60 * 60 * 1000

chrome.runtime.onInstalled.addListener((details) => {
    chrome.tabs.create({url : "/src/options/index.html"}); 
});

chrome.alarms.create({ periodInMinutes: 1})

chrome.alarms.onAlarm.addListener(async (alarm) => {

    // First, get our configuration

    const options = await getOptionsAsync()
    console.debug('options', options)
    const autoPrune = options['auto-prune']
    const pruneThreshold = options['prune-threshold'] * toOneDayInMilliseconds
    const autoGroup = options['auto-group']
    const autoGroupThreshold = options['auto-group-threshold'] * toOneDayInMilliseconds
    const autoGroupName = options['auto-group-name']
    const autoBookmark = options['auto-prune-bookmark']
    const autoBookmarkName = options['auto-prune-bookmark-name']

    const tracker = new TabTracker()
    let openTabs = await chrome.tabs.query({})
    await tracker.init(openTabs)
    const grouper = new TabGrouper()
    const pruner = new TabPruner()
    const bookmarker = new TabBookmarker(autoBookmarkName)

    let candidates
    // Check for tabs to prune
    console.debug('open tabs', openTabs)

    if (autoPrune) {
        [candidates, openTabs] = tracker.findTabsExceedingThreshold(openTabs, pruneThreshold)

        if (autoBookmark) {
            await bookmarker.bookmarkTabs(candidates)
        }
        await pruner.pruneTabs(candidates, pruneThreshold)
    }
    console.debug('remaining tabs', openTabs)

    if (autoGroup) {
        const group = {
            title: autoGroupName,
            color: "yellow",
            collapsed: true
        }
        [candidates, openTabs] = tracker.findTabsExceedingThreshold(openTabs, autoGroupThreshold)
        await grouper.groupTabs(candidates, group)
    }
})

// When a new tab might be created
chrome.tabs.onUpdated.addListener(async(tabId, updatedInfo, tab) => { 

    if (updatedInfo.status != 'loading') return

    console.debug('opening tab: ', tab)
    const tracker = new TabTracker()
    const grouper = new TabGrouper()
    const pruner = new TabPruner()
    let openTabs = await chrome.tabs.query({})
    await tracker.init(openTabs)
    tracker.track(tab)

    const options = await getOptionsAsync()

    if (options['auto-deduplicate']) {
        const deduplicator = new TabDeduplicator(lock)
        deduplicator.deduplicateTab(tab)
    }

    // TODO: this is incorrect if tab deduplicated
    if (options['tab-lru-enabled']) {
        const destination = options['tab-lru-destination']
        const group = {
            title: options['auto-group-name'],
            color: "yellow",
            collapsed: true
        }
        const raw = await localStorageGetAsync('tab-lru')
        let lru

        if (Object.keys(raw).length > 0) {
            lru = LRU.deserialize(raw['tab-lru'])
        }
        else {
            lru = new LRU(new Set(), options['tab-lru-size'])
        }
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

            if (!(lru.cache.has(k))) {
                const removed = lru.add(tabId)
                removed.forEach(id => {
                    evicted.push(openTabsMap[id])
                })
            }
        }
        
        console.debug('evicting:', evicted)

        if (destination === 'remove') {
            await pruner.pruneTabs(evicted)
        }
        else if (destination === 'group') {
            await grouper.groupTabs(evicted, group)
        }
        //const evicted = lru.add(tab.id)
        const serialized = lru.serialize()
        await localStorageSetAsync({'tab-lru': serialized})
    }
})

// Whenever a tab comes into focus
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tracker = new TabTracker()
    const openTabs = await chrome.tabs.query({})
    await tracker.init(openTabs)
    await tracker.track({id: activeInfo.tabId})
})

