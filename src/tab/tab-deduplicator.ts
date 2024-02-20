import { pollTabForStatus } from "~util"
import { type Tab } from "../types"

class TabDeduplicator {
  tabLock: Set<number>
  createdTabs: Set<number>

  constructor(tabLock: Set<number>, createdTabs: Set<number>) {
    this.tabLock = tabLock
    this.createdTabs = createdTabs
    this.deduplicateTab = this.deduplicateTab.bind(this)
  }

  async deduplicateTab(tab: Tab, openTabs: Tab[]) {
    tab.id = tab.id ?? -1

    console.debug("open tabs when checking to deduplicate tab", openTabs, this.tabLock, tab.id, tab.url)

    if (
      this.tabLock.has(tab.id) ||
      tab.url == "chrome://newtab/" ||
      tab.url == "about:newtab" ||
      tab.url == "about:blank"
    ) {
      return false
    }
    this.tabLock.add(tab.id)
    // Chromes query pattern matching doesn't seem to work on certain exact matches
    // so we grab all opened tabs and check it ourselves
    const index = openTabs.findIndex((t) => {
      return t.id != tab.id && tab.url == t.url && t.status == "complete" // NEW: check that the existing tab is also already loaded
    })

    // Try-catch so we always remove the lock
    try {
      if (index > -1) {
        console.debug("deduplicating tab", tab.id, tab)

        if (tab.active) {
          const highlightInfo = {
            tabs: openTabs[index].index,
            windowId: openTabs[index].windowId
          }
          await chrome.tabs.highlight(highlightInfo)
          await chrome.windows.update(openTabs[index].windowId, {
            focused: true
          })
        }
        // TODO: might need to handle some concurrency-related edge case where we goBack and have a duplicate as well
        // Try to navigate backwards on the previous tab, polling until the navigation is complete (timing out after 5s)
        try {
          // TODO: potentially recursively go back until we don't have a duplicate
          await chrome.tabs.goBack(tab.id)
          const updated = await pollTabForStatus(tab, "complete", 10000)

          // If the tab was previously opened by explicitly creating a new tab, and navigating to the link
          // Or if we still have the same URL after going back,
          // Remove the tab.
          if (updated.url == "chrome://newtab/" || updated.url == "about:newtab" || updated.url == 'about:blank' || tab.url == updated.url) {
            console.debug("removing tab", tab.id)
            await chrome.tabs.remove(tab.id)
          }
        } catch (e) {
          if (e.message.includes("Cannot find a next page in history")) {
            await chrome.tabs.remove(tab.id)
          } else {
            throw e
          }
        }
      }
    } catch (e) {
      console.error("error deduplicating tab", e)
    } finally {
      this.tabLock.delete(tab.id)
      return index > -1
    }
  }
}
export default TabDeduplicator
