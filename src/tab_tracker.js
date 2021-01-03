class TabTracker {
    constructor(tabsStorageKey="tabs") {
        this.tabsStorageKey = tabsStorageKey
        // TODO: filter closed tabs
        this.loadState(tabsStorageKey, (tabs) => {
            
            if (tabs == {}) {
                this.trackAllOpenTabs()
            }
            else {
                this.tabs = tabs
            }
        })
    }
    
    tabShouldBePruned(tabId, threshold) {
        
        const now = new Date()

        if (tabId in this.tabs) {
            return now - this.tabs[tabId] > threshold
        }
        return false
    }

    trackAllTabs() {
        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => this.track(tab.id))
        })
    }

    remove(tabId) {
        
        if (tabId in this.tabs) {
            return delete this.tabs[tabId]
        }
        return
    }

    track(tabId) {
        this.tabs[tabId] = new Date()
        console.log(this.tabs)
        this.saveState(this.tabsStorageKey, () => {
            var error = chrome.runtime.lastError

            if (error) {  
               return console.error(error)
            }
        })
    }

    serializeTabs(tabs) {
        const serialized = {}

        for(const key in tabs) {
            serialized[key] = tabs[key].toString()
        }
        return serialized
    }

    deserializeTabs(tabs) {
        const deserialized = {}

        if (tabs) {
            for(const key in tabs) {
                deserialized[key] = Date.parse(tabs[key])
            }
        }
        return deserialized
    }

    saveState(key, callback) {
        const serialized = this.serializeTabs(this.tabs)
        chrome.storage.local.set({[key]: serialized}, callback)
    }

    loadState(key, callback) {
        chrome.storage.local.get(key, (tabs) => {
            var error = chrome.runtime.lastError

            if (error) {  
               return console.error(error)
            }
            callback(this.deserializeTabs(tabs))
        })
    }
}

export {
    TabTracker
}