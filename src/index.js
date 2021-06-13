import { TabTracker, TabPruner, TabDeduplicator, TabGrouper, TabBookmarker } from './tabs/index.js'
import AlarmHandler from './handlers/alarm.js'
import { getOptionsAsync } from './options/index.js'
import TabCreatedHandler from './handlers/tab-created.js'

const lock = new Set()

chrome.runtime.onInstalled.addListener((details) => {
    chrome.tabs.create({url : '/src/options/index.html'}); 
});

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
    const handler = new AlarmHandler(tracker, grouper, pruner, options)
    await handler.execute()
})

// When a new tab might be created
chrome.tabs.onUpdated.addListener(async(tabId, updatedInfo, tab) => { 

    if (updatedInfo.status != 'loading') return

    console.debug('opening tab: ', tab)
    let bookmarker
    const options = await getOptionsAsync()
    const tracker = new TabTracker()
    const grouper = new TabGrouper()

    if (options['auto-prune-bookmark']) {
        bookmarker = new TabBookmarker(options['auto-prune-bookmark-name'])
    }
    const pruner = new TabPruner(bookmarker)
    const deduplicator = new TabDeduplicator(lock)
    const handler = new TabCreatedHandler(tracker, grouper, pruner, deduplicator, options)
    await handler.execute(tab)
})

// Whenever a tab comes into focus
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tracker = new TabTracker()
    const openTabs = await chrome.tabs.query({})
    await tracker.init(openTabs)
    await tracker.track({id: activeInfo.tabId})
})

