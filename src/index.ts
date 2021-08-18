import { TabTracker, TabPruner, TabDeduplicator, TabGrouper, TabBookmarker } from './tabs/index.js'
import AlarmHandler from './handlers/alarm.js'
import { getOptionsAsync } from './options/index.js'
import TabCreatedHandler from './handlers/tab-created.js'
import TabFocusedHandler from './handlers/tab-focused'

const lock = new Set<number>()

chrome.alarms.create({ periodInMinutes: 1})

// Ran every minute
chrome.alarms.onAlarm.addListener(async (alarm) => {
    let bookmarker
    const options = await getOptionsAsync()

    const tracker = new TabTracker()
    const grouper = new TabGrouper()

    if (options['auto-prune-bookmark']) {
        bookmarker = new TabBookmarker(options['auto-prune-bookmark-name'])
    }
    const pruner = new TabPruner(bookmarker)
    const handler = new AlarmHandler({ tracker, grouper, pruner, options })
    await handler.execute()
})

// When a new tab might be created
chrome.tabs.onUpdated.addListener(async(tabId, updatedInfo, tab) => { 

    console.debug('tab updated', updatedInfo, tab)

    // TODO: handle when updatedInfo is tab being ungrouped
    if (updatedInfo.status != 'loading') return

    let bookmarker
    const options = await getOptionsAsync()

    const tracker = new TabTracker()
    const grouper = new TabGrouper()

    if (options['auto-prune-bookmark']) {
        bookmarker = new TabBookmarker(options['auto-prune-bookmark-name'])
    }
    const pruner = new TabPruner(bookmarker)
    const deduplicator = new TabDeduplicator(lock)
    const handler = new TabCreatedHandler({ tracker, grouper, pruner, deduplicator, options })
    await handler.execute(tab)
})

// Whenever a tab comes into focus
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    let bookmarker
    
    const options = await getOptionsAsync()
    const tracker = new TabTracker()
    const grouper = new TabGrouper()

    if (options['auto-prune-bookmark']) {
        bookmarker = new TabBookmarker(options['auto-prune-bookmark-name'])
    }
    const pruner = new TabPruner(bookmarker)
    const handler = new TabFocusedHandler({ tracker, grouper, pruner, options })
    await handler.execute(activeInfo)
})
