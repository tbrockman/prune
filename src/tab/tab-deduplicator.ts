import { pollTabForStatus } from "~util"
import { type Tab } from "../types"
import { Features } from "~config"
import { removeTrailingSlashes } from "~util/string"

const NEW_TAB_URLS = ["chrome://newtab", "about:newtab", "about:blank", "chrome://startpageshared", ""]

class TabDeduplicator {
  tabLock: Set<number>
  canHighlight: boolean
  closeAllDuplicates: boolean

  constructor(tabLock: Set<number>, canHighlight = true, closeAllDuplicates = true) {
    this.tabLock = tabLock
    this.canHighlight = canHighlight
    this.closeAllDuplicates = closeAllDuplicates
    this.deduplicateTab = this.deduplicateTab.bind(this)
  }

  async undoNavigation(tab: Tab) {
    // TODO: might need to handle some concurrency-related edge case where we goBack and have a duplicate as well
    // Try to navigate backwards on the previous tab, polling until the navigation is complete (timing out after 5s)
    try {

      // TODO: potentially recursively go back until we don't have a duplicate
      await chrome.tabs.goBack(tab.id)
      const updated = await pollTabForStatus(tab, "complete", 10000)

      // If the tab was previously opened by explicitly creating a new tab, and navigating to the link
      // Or if we still have the same URL after going back,
      // Remove the tab.

      if (NEW_TAB_URLS.includes(removeTrailingSlashes(updated.url))) {
        await chrome.tabs.remove(tab.id)
      }
    } catch (e) {
      console.debug("error caught while deduplicating", e)

      if (e.message.includes("Cannot find a next page in history")) {
        await chrome.tabs.remove(tab.id)
      } else {
        throw e
      }
    }
  }

  async deduplicateTab(tab: Tab, openTabs: Tab[]) {
    tab.id = tab.id ?? -1
    const url = removeTrailingSlashes(tab.url ?? '')

    console.debug("open tabs when checking to deduplicate tab", openTabs, this.tabLock, tab.id, tab.url, url)

    if (
      this.tabLock.has(tab.id) ||
      NEW_TAB_URLS.includes(url)
    ) {
      return false
    }
    this.tabLock.add(tab.id)
    // Chromes query pattern matching doesn't seem to work on certain exact matches
    // so we grab all opened tabs and check it ourselves
    const index = openTabs.findIndex((t) => {
      return t.id != tab.id && url == removeTrailingSlashes(t.url) && t.status == "complete" // NEW: check that the existing tab is also already loaded
    })

    // Try-catch so we always remove the lock
    try {
      if (index > -1) {
        console.debug("deduplicating tab", tab.id, tab)

        const highlightInfo = {
          tabs: openTabs[index].index,
          windowId: openTabs[index].windowId
        }

        if (this.canHighlight) {
          await chrome.tabs.highlight(highlightInfo)
        } else {
          await chrome.tabs.update(openTabs[index].id, {
            active: true,
            highlighted: true,
            selected: true
          })
        }
        await chrome.windows.update(openTabs[index].windowId, {
          focused: true
        })

        if (this.closeAllDuplicates) {
          await chrome.tabs.remove(tab.id)
        } else {
          await this.undoNavigation(tab)
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
