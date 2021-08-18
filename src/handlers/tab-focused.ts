import { TabGrouper, TabPruner, TabTracker } from "../tabs"
import { Tab } from '../types'

type TabFocusedHandlerArgs = {
    tracker: TabTracker
    grouper: TabGrouper
    pruner: TabPruner
    options: any
}

class TabFocusedHandler {

    tracker: TabTracker
    grouper: TabGrouper
    pruner: TabPruner
    options: any

    constructor({ tracker, grouper, pruner, options }: TabFocusedHandlerArgs) {
        this.tracker = tracker
        this.grouper = grouper
        this.pruner = pruner
        this.options = options
    }

    async execute(activeInfo: any) {
        const openTabs = await chrome.tabs.query({})
        await this.tracker.init(openTabs)
        await this.tracker.track({ id: activeInfo.tabId } as Tab)
        
        const group = {
            title: this.options['auto-group-name'],
            color: "yellow",
            collapsed: true
        }
    }
}

export default TabFocusedHandler