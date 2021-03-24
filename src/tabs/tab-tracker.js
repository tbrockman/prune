class TabTracker {

    constructor(tabsStorageKey="tabs") {
        this.tabsStorageKey = tabsStorageKey
        this.tabs = {}
        this.trackTabs = this.trackTabs.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)
        this.continueTrackingTabs = this.continueTrackingTabs.bind(this)
        this.getTabLastViewed = this.getTabLastViewed.bind(this)
        this.remove = this.remove.bind(this)
        this.track = this.track.bind(this)
    }

    initialize(callback) {

        this.loadState(this.tabsStorageKey, (tabs) => {

            chrome.tabs.query({}, openTabs => {
                
                if (Object.keys(tabs).length === 0) {
                    this.trackTabs(openTabs)
                }
                else {
                    this.tabs = tabs
                    this.continueTrackingTabs(openTabs)
                }
                return callback()
            })
        })
    }

    getTabLastViewed(tabId) {

        if (tabId in this.tabs) {
            return this.tabs[tabId]
        }
    }

    trackTabs(tabs) {
        tabs.forEach(tab => this.track(tab.id))
    }

    remove(tabId) {
        
        if (tabId in this.tabs) {
            return delete this.tabs[tabId]
        }
        return
    }

    track(tabId) {
        this.tabs[tabId] = new Date()

        this.saveState(this.tabsStorageKey, () => {
            var error = chrome.runtime.lastError

            if (error) {  
               return console.error(error)
            }
        })
    }

    continueTrackingTabs(tabs) {

        for (const tabId in this.tabs) {
            
            if (!(tabs.hasOwnProperty(tabId))) {
                this.remove(tabId)
            }
        }

        for (const tabId in tabs) {

            if (!(tabId in this.tabs)) {
                this.tabs[tabId] = new Date()
            }
        }

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
                deserialized[key] = new Date(tabs[key])
            }
        }
        return deserialized
    }

    saveState(key, callback) {
        const serialized = this.serializeTabs(this.tabs)
        chrome.storage.local.set({[key]: serialized}, callback)
    }

    loadState(key, callback) {
        chrome.storage.local.get(key, (data) => {
            var error = chrome.runtime.lastError
            
            if (error) {  
               return console.error(error)
            }

            let tabs;

            if ('tabs' in data) {
                tabs = data['tabs']
            }
            callback(this.deserializeTabs(tabs))
        })
    }
}

export {
    TabTracker
}