import { Tab } from "../types"

class TabDeduplicator {
    tabLock: Set<number>

    constructor(tabLock: Set<number>) {
        this.tabLock = tabLock
        this.deduplicateTab = this.deduplicateTab.bind(this)
    }

    async deduplicateTab(tab: Tab, openTabs: Tab[]) {

        tab.id = tab.id ?? -1

        if (tab.status != 'loading' || this.tabLock.has(tab.id) || tab.url == "chrome://newtab/") {
            return false
        }
        this.tabLock.add(tab.id)
        // Chromes query pattern matching doesn't seem to work on certain exact matches
        // so we grab all opened tabs and check it ourselves
        const index = openTabs.findIndex((t) => t.id != tab.id && tab.url == t.url)

        if (index > -1) {

            console.debug('deduplicating tab', tab.id, tab)

            if (tab.active !== true) {
                const highlightInfo = {
                    tabs: openTabs[index].index,
                    windowId: openTabs[index].windowId
                }

                await chrome.tabs.highlight(highlightInfo)
                await chrome.windows.update(openTabs[index].windowId, {
                    focused: true
                })
            }

            await chrome.tabs.remove(tab.id)
        }
        this.tabLock.delete(tab.id)
        return index > -1
    }
}

export {
    TabDeduplicator
}