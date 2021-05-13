class TabTracker {

    constructor(tabsStorageKey="tabs") {
        this.tabsStorageKey = tabsStorageKey
        this.tabs = {}
        this.initialize = this.initialize.bind(this)
        this.trackTabs = this.trackTabs.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)
        this.filterClosedTabsAndTrackNew = this.filterClosedTabsAndTrackNew.bind(this)
        this.getTabLastViewed = this.getTabLastViewed.bind(this)
        this.remove = this.remove.bind(this)
        this.track = this.track.bind(this)
    }

    initialize(callback) {

        console.debug('initializing')

        this.loadState(this.tabsStorageKey, (tabs) => {

            chrome.tabs.query({}, openTabs => {
                
                if (Object.keys(tabs).length === 0) {
                    console.debug('no loaded tabs found in storage')
                    this.trackTabs(openTabs)
                }
                else {
                    this.tabs = tabs
                    console.debug('loaded tabs found in storage', tabs)
                    this.filterClosedTabsAndTrackNew(this.tabs, openTabs)
                }
                
                console.debug('resolved tab state', this.tabs)
                return callback()
            })
        })
    }

    getTabLastViewed(tabId) {
        return this.tabs[tabId]
    }

    trackTabs(tabs) {
        tabs.forEach(tab => this.track(tab.id))
    }

    filterClosedTabsAndTrackNew(tabs, openTabs) {
        const openTabSet = new Set()

        openTabs.forEach(tab => {
            openTabSet.add(tab.id.toString())

            if (!tabs.hasOwnProperty(tab.id)) {
                this.track(tab.id)
            }
        })

        for (const tabId in this.tabs) {
            
            if (!openTabSet.has(tabId)) {
                delete tabs[tabId]
            }
        }

        this.saveState(this.tabsStorageKey, () => {
            var error = chrome.runtime.lastError

            if (error) {  
               return console.error(error)
            }
        })
    }

    remove(tabId) {
        
        if (tabId in this.tabs) {
            return delete this.tabs[tabId]
        }
        return
    }

    track(tabId) {
        console.debug('tracking tab', tabId)
        this.tabs[tabId] = new Date()

        this.saveState(this.tabsStorageKey, () => {
            var error = chrome.runtime.lastError

            if (error) {  
               return console.error(error)
            }
        })
    }

    serializeTabs(tabs) {
        const serialized = {}

        for (const key in tabs) {
            serialized[key] = tabs[key].toString()
        }
        return serialized
    }

    deserializeTabs(tabs) {
        const deserialized = {}

        if (tabs) {

            for (const key in tabs) {
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
            console.debug('raw data', data)
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