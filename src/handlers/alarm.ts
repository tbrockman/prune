import TabGrouper from "~tab/tab-grouper"
import TabPruner from "~tab/tab-pruner"
import TabTracker from "~tab/tab-tracker"
import { type Tab } from "../types"

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

  constructor({ tracker, grouper, pruner, options }: AlarmHandlerArgs) {
    this.tracker = tracker
    this.grouper = grouper
    this.pruner = pruner
    this.autoPrune = options["auto-prune"]
    this.pruneThreshold = options["prune-threshold"] * toOneDayInMilliseconds
    this.autoGroup = options["auto-group"]
    this.autoGroupThreshold =
      options["auto-group-threshold"] * toOneDayInMilliseconds
    this.autoGroupName = options["auto-group-name"]
    this.autoBookmark = options["auto-prune-bookmark"]
  }

  async execute() {
    let openTabs = await chrome.tabs.query({})
    let candidates: Tab[] = []
    await this.tracker.init(openTabs)
    console.debug("open tabs", openTabs)
    const group = {
      title: this.autoGroupName,
      color: "yellow",
      collapsed: true
    }

    if (this.autoPrune) {
      [candidates, openTabs] = this.tracker.findTabsExceedingThreshold(
        openTabs,
        this.pruneThreshold
      )
      const filter = [-1]

      if (this.autoGroup) {
        const groups = await chrome.tabGroups.query({
          title: group["title"]
        })

        if (groups.length > 0) {
          filter.push(groups[0].id)
        }
      }
      console.debug("before filtering any grouped tabs", candidates)
      // leave any tabs which have a groupId
      // that isn't our autoGroup alone
      candidates = candidates.filter((tab) =>
        filter.includes(tab.groupId ? tab.groupId : -1)
      )
      console.debug("should be pruning", candidates)
      await this.pruner.pruneTabs(candidates)
    }
    console.debug("remaining tabs", openTabs)

    if (this.autoGroup) {
      const [toGroup] = this.tracker.findTabsExceedingThreshold(
        openTabs,
        this.autoGroupThreshold
      )
      console.debug("should be grouping", toGroup)
      await this.grouper.groupTabs(toGroup, group)
    }
  }
}

export default AlarmHandler
