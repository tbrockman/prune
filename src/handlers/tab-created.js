class TabCreatedHandler {
    
    constructor({ tracker, grouper, pruner, deduplicator, lru, options }) {
        this.tracker = tracker
        this.grouper = grouper
        this.pruner = pruner
        this.lru = lru
        this.deduplicator = deduplicator
        this.options = options
    }

    async execute(tab) {
    
        if (this.options['auto-deduplicate']) {
            this.deduplicator.deduplicateTab(tab)
        }

        let openTabs = await chrome.tabs.query({})
        await this.tracker.init(openTabs)
        await this.tracker.track(tab)

        // TODO: this is incorrect if tab deduplicated
        if (this.lru) {
            const group = {
                title: this.options['auto-group-name'],
                color: "yellow",
                collapsed: true
            }
            console.debug('open tabs to filter: ', openTabs)
            openTabs = openTabs.filter(tab => tab.groupId === -1)
            console.debug('open tabs post-filter:' , openTabs)
            const evicted = await this.lru.init(openTabs)

            if (this.lru.destination === 'remove') {
                await this.pruner.pruneTabs(evicted)
            }
            else if (this.lru.destination === 'group') {
                await this.grouper.groupTabs(evicted, group)
            }
        }
    }
}

export default TabCreatedHandler