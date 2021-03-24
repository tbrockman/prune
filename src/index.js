import { TabTracker, TabPruner, TabDeduplicator, TabGrouper } from './tabs/index.js'
import { getOptions } from './options/index.js'

const lock = new Set()
const toOneDayInMilliseconds = 24 * 60 * 60 * 1000

chrome.runtime.onInstalled.addListener(() => {
    showReadme();
});

function showReadme() {
    //chrome.tabs.create({ url:"https://theo.lol" });
}

chrome.alarms.create({ periodInMinutes: 1})

chrome.alarms.onAlarm.addListener((alarm) => {

    // First, get our configuration

    getOptions((options) => {

        const autoPrune = options['auto-prune']
        const pruneThreshold = options['prune-threshold'] * toOneDayInMilliseconds
        const autoGroup = options['auto-group']
        const autoGroupThreshold = options['auto-group-threshold'] * toOneDayInMilliseconds
        const autoGroupName = options['auto-group-name']

        const tracker = new TabTracker()
        tracker.initialize(() => {

            const grouper = new TabGrouper(tracker)
            const pruner = new TabPruner(tracker)

            chrome.tabs.query({}, (tabs) => {
                // Check for tabs to prune
                let remainingTabs = tabs
    
                if (autoPrune) {
                    remainingTabs = pruner.pruneTabs(tabs, pruneThreshold)
                }
    
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
})

// When a new tab might be created
chrome.tabs.onUpdated.addListener((tabId, updatedInfo, tab) => { 

    const tracker = new TabTracker()
    tracker.initialize(() => {

        tracker.track(tab.id)
        const deduplicator = new TabDeduplicator(lock)
        deduplicator.deduplicateTab(tab)
    })
})

// Whenever a tab comes into focus
chrome.tabs.onActivated.addListener((activeInfo) => {

    const tracker = new TabTracker()
    tracker.initialize(() => {

        tracker.track(activeInfo.tabId)
    })
})