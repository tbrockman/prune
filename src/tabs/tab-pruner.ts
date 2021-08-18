import { Tab } from "../types"
import { TabBookmarker } from "./tab-bookmarker"

class TabPruner {

    bookmarker: TabBookmarker | undefined

    constructor (bookmarker: TabBookmarker | undefined) {
        this.bookmarker = bookmarker
        this.pruneTabs = this.pruneTabs.bind(this)
    }

    async pruneTabs(tabs: Tab[]) {

        if (tabs.length == 0) return

        if (this.bookmarker) {
            this.bookmarker.bookmarkTabs(tabs)
        }

        tabs.forEach(async tab => {

            if (tab.id) {
                try {
                    await chrome.tabs.remove(tab.id)
                } catch (error) {
                    console.error(error)
                }
            }
        })
    }
}

export {
    TabPruner
}