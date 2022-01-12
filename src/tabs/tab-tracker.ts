import { localStorageGetAsync, localStorageSetAsync } from '../util/index.js'
import { Tab } from '../types'

class TabTracker {

    tabsStorageKey: string
    tabs: Map<string, number>

    constructor(tabsStorageKey='tabs')  {
        this.tabsStorageKey = tabsStorageKey
        this.tabs = new Map()
        this.init = this.init.bind(this)
        this.saveStateAsync = this.saveStateAsync.bind(this)
        this.loadStateAsync = this.loadStateAsync.bind(this)
        this.trackTabs = this.trackTabs.bind(this)
        this.filterClosedTabsAndTrackNew = this.filterClosedTabsAndTrackNew.bind(this)
        this.getTabLastViewed = this.getTabLastViewed.bind(this)
        this.remove = this.remove.bind(this)
        this.track = this.track.bind(this)
    }

    async init(openTabs: Tab[]) {
        console.debug('initializing tracker')
        const tabs = await this.loadStateAsync(this.tabsStorageKey)
                     
        if (tabs.size === 0) {
            console.debug('no loaded tabs found in storage')
            await this.trackTabs(openTabs)
        }
        else {
            this.tabs = tabs
            console.debug('loaded tabs found in storage', tabs)
            await this.filterClosedTabsAndTrackNew(openTabs)
        }
        console.debug('resolved tab state', this.tabs)
    }

    limitNumberOfVisibleTabs(tabs: Tab[], limit: number): [Tab[], Tab[]] {
        // order the tabs we're given by their position in our tracked map
        const orderBy = new Map<string, number>()
        let index = 0
        this.tabs.forEach((val, key) => {
            // sort in descending order
            orderBy.set(key, this.tabs.size - index - 1)
            index += 1
        })
        const sorted = tabs.sort((a, b) => (orderBy.get(a.url ?? '') ?? 0) - (orderBy.get(b.url ?? '') ?? 0))
        // slice [0,limit) for visible, [limit+1 - tabs.length) for hidden 
        const visible = sorted.slice(0, limit)
        const hidden = sorted.slice(limit, tabs.length)

        return [visible, hidden]
    }

    findTabsExceedingThreshold(tabs: Tab[], threshold: number): [Tab[], Tab[]] {
        const exceeds: Tab[] = []
        const remaining: Tab[] = []

        tabs.forEach(tab => {
            const now = Date.now()
            const lastViewed = this.getTabLastViewed(tab.url ?? '') ?? now
            console.debug('threshold', threshold, 'now - lastViewed', now - lastViewed)
            const passesThreshold = (now - lastViewed >= threshold)

            if (passesThreshold) {
                exceeds.push(tab)
            }
            else {
                remaining.push(tab)
            }
        })
        return [exceeds, remaining]
    }

    getTabLastViewed(tabUrl: string): number | undefined {
        return this.tabs.get(tabUrl)
    }

    async trackTabs(tabs: Tab[]) {
        tabs.forEach(async tab => await this.track(tab))
    }

    async filterClosedTabsAndTrackNew(openTabs: Tab[]) {
        const openTabSet: Set<string> = new Set()
        console.debug('currently open tabs when filtering: ', openTabs)

        openTabs.forEach(async tab => {

            if (tab.url) {
                openTabSet.add(tab.url)

                if (!this.tabs.has(tab.url)) {
                    await this.track(tab)
                }
            }
        })
        console.debug('open tabs set: ', openTabSet)

        this.tabs.forEach((val, key) => {

            if (!openTabSet.has(key)) {
                console.debug('removing non-open tab', key)

                this.remove(key)
            }
        })

        await this.saveStateAsync(this.tabsStorageKey)
    }

    remove(tabUrl: string) {
        
        if (this.tabs.has(tabUrl)) {
            this.tabs.delete(tabUrl)
        }
        return
    }

    async track(tab: Tab) {
        
        if (tab.url) {
            console.debug('tracking tab', tab.url)

            if (this.tabs.has(tab.url)) {
                this.tabs.delete(tab.url)
            }
            this.tabs.set(tab.url, new Date().getTime())
    
            try {
                await this.saveStateAsync(this.tabsStorageKey)            
            } catch (error) {
                console.error(error)
            }
        }
    }

    serializeTabs(tabs: Map<string, number>) {
        let serialized: [string, number][] = []
        tabs.forEach((val, key) => {
            serialized.push([key, val])
        })
        return JSON.stringify(serialized)
    }

    deserializeTabs(tabs: [string, number][]) {
        let deserialized = new Map<string, number>()
        tabs.forEach(([url, date]: [string, number]) => {
            deserialized.set(url, date)
        })
        return deserialized
    }

    async saveStateAsync(key: string) {
        const serialized = this.serializeTabs(this.tabs)
        await localStorageSetAsync({[key]: serialized})
    }

    async loadStateAsync(key: string) {
        console.debug('await local storage get')
        const data = await localStorageGetAsync(key)
        let tabs = []

        console.debug('raw data', data)

        if ('tabs' in data) {
            tabs = JSON.parse(data['tabs'])
        }
        return this.deserializeTabs(tabs)
    }
}

export {
    TabTracker
}