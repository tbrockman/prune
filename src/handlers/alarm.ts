import { TabGrouper, TabPruner, TabTracker } from "../tabs"
import { Tab } from "../types"

const toOneDayInMilliseconds = 24 * 60 * 60 * 1000

type AlarmHandlerArgs = {
    tracker: TabTracker
    grouper: TabGrouper
    pruner: TabPruner
    options: any
}

class AlarmHandler {
    tracker: TabTracker
    grouper: TabGrouper
    pruner: TabPruner
    autoPrune: boolean
    pruneThreshold: number
    autoGroup: boolean
    autoGroupThreshold: number
    autoGroupName: string
    autoBookmark: boolean

    constructor({tracker, grouper, pruner, options}: AlarmHandlerArgs) {
        this.tracker = tracker
        this.grouper = grouper
        this.pruner = pruner
        this.autoPrune = options['auto-prune']
        this.pruneThreshold = options['prune-threshold'] * toOneDayInMilliseconds
        this.autoGroup = options['auto-group']
        this.autoGroupThreshold = options['auto-group-threshold'] * toOneDayInMilliseconds
        this.autoGroupName = options['auto-group-name']
        this.autoBookmark = options['auto-prune-bookmark']
    }

    async execute() {
        let openTabs = await chrome.tabs.query({})
        let candidates: Tab[] = []
        await this.tracker.init(openTabs)
        console.debug('open tabs', openTabs)
    
        if (this.autoPrune) {
            [candidates, openTabs] = this.tracker.findTabsExceedingThreshold(openTabs, this.pruneThreshold)
            await this.pruner.pruneTabs(candidates)
        }
        console.debug('remaining tabs', openTabs)
    
        if (this.autoGroup) {
            const group = {
                title: this.autoGroupName,
                color: "yellow",
                collapsed: true
            }
            // @ts-ignore
            const [toGroup, ] = this.tracker.findTabsExceedingThreshold(openTabs, this.autoGroupThreshold)
            await this.grouper.groupTabs(toGroup, group)
        }
    }
}

export default AlarmHandler