import { TabPruner } from './tab-pruner.js'
import { TabTracker } from './tab-tracker.js'

class TabManager {
    constructor() {
        this.lock = new Set()
        this.tabTracker = new TabTracker()
        this.tabPruner = new TabPruner(this.tabTracker, 60*1000, 1000*60*60*24*5)
        this.tabPruner.start()

        chrome.tabs.onUpdated.addListener((tabId, updatedInfo, tab) => { this.onTabUpdated(tab)})
        chrome.tabs.onActivated.addListener((activeInfo) => {this.onTabActivated(activeInfo.tabId)})
    }

    onTabActivated(tabId) {
        this.tabTracker.track(tabId)
    }

    onTabUpdated(tab) {
        this.tabTracker.track(tab.id)

        if (tab.status != 'loading' || this.lock.has(tab.id) || tab.url == "chrome://newtab/") {
            return
        }
        this.lock.add(tab.id)

        // Chromes query pattern matching doesn't seem to work on certain exact matches
        // so we grab all opened tabs and check it ourselves
        chrome.tabs.query({}, (tabs) => {
        
            const index = tabs.findIndex((t) => t.id != tab.id && tab.url == t.url)

            if (index > -1) {

                const highlightInfo = {
                    tabs: tabs[index].index,
                    windowId: tabs[index].windowId
                }
                chrome.tabs.highlight(highlightInfo)
                chrome.windows.update(tabs[index].windowId, {
                    focused: true
                })
                chrome.tabs.remove(tab.id, () => {

                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError)
                    }
                    this.lock.delete(tab.id)
                })
            }
            else {
                this.lock.delete(tab.id)
            }
        })
    }
}

export {
    TabManager
}