class TabPruner {

    constructor (tabBookmarker) {
        this.tabBookmarker = tabBookmarker
        this.pruneTabs = this.pruneTabs.bind(this)
    }

    async pruneTabs(tabs) {

        if (tabs.length == 0) return

        if (this.tabBookmarker) {
            this.tabBookmarker.bookmarkTabs(tabs)
        }

        await tabs.forEach(async tab => {
            try {
                await chrome.tabs.remove(tab.id)
            } catch (error) {
                console.error(error)
            }
        })
    }
}

export {
    TabPruner
}