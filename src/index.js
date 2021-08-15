import { TabTracker, TabPruner, TabDeduplicator, TabGrouper, TabBookmarker, TabLRU } from './tabs/index.js'
import AlarmHandler from './handlers/alarm.js'
import { getOptionsAsync } from './options/index.js'
import TabCreatedHandler from './handlers/tab-created.js'
import TabFocusedHandler from './handlers/tab-focused'

const lock = new Set()

chrome.alarms.create({ periodInMinutes: 1})

// Ran every minute
chrome.alarms.onAlarm.addListener(async (alarm) => {
    let bookmarker
    let lru
    const options = await getOptionsAsync()

    if (options['tab-lru-enabled']) {
        lru = new TabLRU({
            lruSize: options['tab-lru-size'],
            destination: options['tab-lru-destination']
        })
    }

    const tracker = new TabTracker()
    const grouper = new TabGrouper()

    if (options['auto-prune-bookmark']) {
        bookmarker = new TabBookmarker(options['auto-prune-bookmark-name'])
    }
    const pruner = new TabPruner(bookmarker)
    const handler = new AlarmHandler(tracker, grouper, pruner, options)
    await handler.execute()
})

// When a new tab might be created
chrome.tabs.onUpdated.addListener(async(tabId, updatedInfo, tab) => { 

    console.debug('tab updated', updatedInfo, tab)

    if (updatedInfo.status != 'loading') return

    let bookmarker
    let lru
    const options = await getOptionsAsync()

    if (options['tab-lru-enabled']) {
        lru = new TabLRU({
            lruSize: options['tab-lru-size'],
            destination: options['tab-lru-destination']
        })
    }

    const tracker = new TabTracker()
    const grouper = new TabGrouper()

    if (options['auto-prune-bookmark']) {
        bookmarker = new TabBookmarker(options['auto-prune-bookmark-name'])
    }
    const pruner = new TabPruner(bookmarker)
    const deduplicator = new TabDeduplicator(lock)
    const handler = new TabCreatedHandler({ tracker, grouper, pruner, deduplicator, lru, options })
    await handler.execute(tab)
})

// Whenever a tab comes into focus
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    let bookmarker
    let lru
    
    const options = await getOptionsAsync()

    if (options['tab-lru-enabled']) {
        lru = new TabLRU({
            lruSize: options['tab-lru-size'],
            destination: options['tab-lru-destination']
        })
    }
    const tracker = new TabTracker()
    const grouper = new TabGrouper()

    if (options['auto-prune-bookmark']) {
        bookmarker = new TabBookmarker(options['auto-prune-bookmark-name'])
    }
    const pruner = new TabPruner(bookmarker)
    const handler = new TabFocusedHandler({ tracker, lru, grouper, pruner, options })
    await handler.execute(activeInfo)
})

