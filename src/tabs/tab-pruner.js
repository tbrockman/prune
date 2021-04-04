class TabPruner {
    constructor (tabTracker) {
        this.tabTracker = tabTracker
        this.pruneTabs = this.pruneTabs.bind(this)
    }

    pruneTabs(tabs, threshold) {

        let remainingTabs = []

        tabs.forEach(tab => {
            let lastViewed = this.tabTracker.getTabLastViewed(tab.id)
            const now = new Date()
            
            if (!lastViewed) {
                this.tabTracker.track(tab.id)
                lastViewed = now
            }
            const tabShouldBePruned = now - lastViewed >= threshold
            
            if (tabShouldBePruned) {

                console.debug('pruning tab', tab.id, tab)

                chrome.tabs.remove(tab.id, () => {
                    var error = chrome.runtime.lastError

                    if (error) {
                       console.error(error)
                    }
                })
            }
            else {
                remainingTabs.push(tab)
            }
        })

        return remainingTabs
    }
}

export {
    TabPruner
}