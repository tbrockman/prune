import { TabTracker, TabPruner, TabDeduplicator, TabGrouper } from './tabs/index.js'
import { getOptions } from './options/index.js'
import { TabBookmarker } from './tabs/tab-bookmarker.js';

const lock = new Set()
const toOneDayInMilliseconds = 24 * 60 * 60 * 1000

chrome.runtime.onInstalled.addListener((details) => {

    if (details.reason == 'update') {

        const version = chrome.runtime.getManifest().version;

        if (details.previousVersion[0] == '1' && version[0] == '2') {
            chrome.runtime.openOptionsPage()
        }
    }

    else if (details.reason == 'install') {
        chrome.runtime.openOptionsPage()
    }
});

chrome.alarms.create({ periodInMinutes: 1})

chrome.alarms.onAlarm.addListener((alarm) => {

    // First, get our configuration

    getOptions((options) => {

        const autoPrune = options['auto-prune']
        const pruneThreshold = options['prune-threshold'] * toOneDayInMilliseconds
        const autoGroup = options['auto-group']
        const autoGroupThreshold = options['auto-group-threshold'] * toOneDayInMilliseconds
        const autoGroupName = options['auto-group-name']
        const autoBookmarkName = options['auto-prune-bookmark-name']

        const tracker = new TabTracker()
        tracker.initialize(async() => {

            console.debug('tracker initialized')
            const grouper = new TabGrouper(tracker)
            const pruner = new TabPruner(tracker)
            const bookmarker = new TabBookmarker(autoBookmarkName)

            let remainingTabs = await chrome.tabs.query({})
            // Check for tabs to prune
            console.debug('open tabs', remainingTabs)
 
            if (autoPrune) {
                let candidates
                [candidates, remainingTabs] = pruner.findTabsToPrune(remainingTabs, pruneThreshold)

                if (autoBookmark) {
                    await bookmarker.bookmarkTabs(candidates)
                }
                pruner.pruneTabs(candidates, pruneThreshold)
            }
            console.debug('remaining tabs', remainingTabs)

            if (autoGroup) {
                const group = {
                    title: autoGroupName,
                    color: "yellow",
                    collapsed: true
                }
                grouper.groupTabs(remainingTabs, group, autoGroupThreshold)
            }
        })
    })
})

// When a new tab might be created
chrome.tabs.onUpdated.addListener(async(tabId, updatedInfo, tab) => { 

    if (updatedInfo.status != 'loading') return

    const tracker = new TabTracker()
    tracker.initialize(() => {

        tracker.track(tab.id)

        getOptions((options) => {

            if (options['auto-deduplicate']) {
                const deduplicator = new TabDeduplicator(lock)
                deduplicator.deduplicateTab(tab)
            }
        })
    })
})

// Whenever a tab comes into focus
chrome.tabs.onActivated.addListener((activeInfo) => {

    const tracker = new TabTracker()
    tracker.initialize(() => {

        tracker.track(activeInfo.tabId)
    })
})