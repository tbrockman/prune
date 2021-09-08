import { TabDeduplicator, TabGrouper, TabPruner, TabTracker } from "../tabs"

type TabCreatedHandlerArgs = {
    tracker: TabTracker
    grouper: TabGrouper
    pruner: TabPruner
    deduplicator: TabDeduplicator
    options: any
}

class TabCreatedHandler {
    tracker: TabTracker
    grouper: TabGrouper
    pruner: TabPruner
    deduplicator: TabDeduplicator
    options: any
    
    constructor({ tracker, grouper, pruner, deduplicator, options }: TabCreatedHandlerArgs) {
        this.tracker = tracker
        this.grouper = grouper
        this.pruner = pruner
        this.deduplicator = deduplicator
        this.options = options
    }

    async execute(tab: any) {
    
        let openTabs = await chrome.tabs.query({})
        let deduplicated = false

        if (this.options['auto-deduplicate']) {
            deduplicated = await this.deduplicator.deduplicateTab(tab, openTabs)
            // TODO: write test since we regressed here
            openTabs = deduplicated ? openTabs.filter(t => t.id != tab.id) : openTabs
        }

        await this.tracker.init(openTabs)
        
        if (deduplicated) return

        await this.tracker.track(tab)

        if (this.options['tab-lru-enabled']) {
            // TODO: this is incorrect if tab deduplicated
            const group = {
                title: this.options['auto-group-name'],
                color: "yellow",
                collapsed: true
            }
            console.debug('open tabs to filter: ', openTabs)
            openTabs = openTabs.filter(tab => tab.groupId === -1)
            console.debug('open tabs post-filter:' , openTabs)
            const size = this.options['tab-lru-size']
            const [open, hidden] = this.tracker.limitNumberOfVisibleTabs(openTabs, size)

            if (this.options['tab-lru-destination'] === 'remove') {
                await this.pruner.pruneTabs(hidden)
            }
            else if (this.options['tab-lru-destination']  === 'group') {
                await this.grouper.groupTabs(hidden, group)
            }
        }
    }
}

export default TabCreatedHandler