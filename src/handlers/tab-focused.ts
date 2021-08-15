import { TabGrouper, TabLRU, TabPruner, TabTracker } from "../tabs"

type TabFocusedHandlerArgs = {
    tracker: TabTracker
    lru: TabLRU
    grouper: TabGrouper
    pruner: TabPruner
    options: any
}

class TabFocusedHandler {

    tracker: TabTracker
    lru: TabLRU
    grouper: TabGrouper
    pruner: TabPruner
    options: any

    constructor({ tracker, lru, grouper, pruner, options }: TabFocusedHandlerArgs) {
        this.tracker = tracker
        this.lru = lru
        this.grouper = grouper
        this.pruner = pruner
        this.options = options
    }

    async execute(activeInfo: any) {
        const openTabs = await chrome.tabs.query({})
        await this.tracker.init(openTabs)
        await this.tracker.track({id: activeInfo.tabId})
        
        if (this.lru) {
            const group = {
                title: this.options['auto-group-name'],
                color: "yellow",
                collapsed: true
            }
            let evicted = await this.lru.init(openTabs)
            const last = await this.lru.add(activeInfo.tabId)
            evicted.push(last)
            
            if (this.lru.destination === 'remove') {
                await this.pruner.pruneTabs(evicted)
            }
            else if (this.lru.destination === 'group') {
                await this.grouper.groupTabs(evicted, group)
            }
        }
    }
}

export default TabFocusedHandler