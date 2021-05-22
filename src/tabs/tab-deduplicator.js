class TabDeduplicator {

    constructor(tabLock) {
        this.tabLock = tabLock
        this.deduplicateTab = this.deduplicateTab.bind(this)
    }

    deduplicateTab(tab) {

        if (tab.status != 'loading' || this.tabLock.has(tab.id) || tab.url == "chrome://newtab/") {
            return
        }
        this.tabLock.add(tab.id)
    
        // Chromes query pattern matching doesn't seem to work on certain exact matches
        // so we grab all opened tabs and check it ourselves
        chrome.tabs.query({}, (tabs) => {
            const index = tabs.findIndex((t) => t.id != tab.id && tab.url == t.url)
    
            if (index > -1) {

                console.debug('deduplicating tab', tab.id, tab)
    
                const highlightInfo = {
                    tabs: tabs[index].index,
                    windowId: tabs[index].windowId
                }

                chrome.tabs.highlight(highlightInfo)
                chrome.windows.update(tabs[index].windowId, {
                    focused: true
                })
                chrome.tabs.remove(tab.id, () => {
                    const error = chrome.runtime.lastError
                    if (error) {
                        console.error(error)
                    }
                    this.tabLock.delete(tab.id)
                })
            }
            else {
                this.tabLock.delete(tab.id)
            }
        })
    }
}

export {
    TabDeduplicator
}