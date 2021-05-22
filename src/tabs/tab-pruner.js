class TabPruner {

    constructor (tabTracker) {
        this.tabTracker = tabTracker
        this.pruneTabs = this.pruneTabs.bind(this)
        this.findTabsToPrune = this.findTabsToPrune.bind(this)
    }

    findTabsToPrune(tabs, threshold) {
        let pruned = []
        let remaining = []

        tabs.forEach(tab => {
            let lastViewed = this.tabTracker.getTabLastViewed(tab.id)
            const now = new Date()
            
            if (!lastViewed) {
                this.tabTracker.track(tab.id)
                lastViewed = now
            }
            const tabShouldBePruned = now - lastViewed >= threshold
            
            if (tabShouldBePruned) {
                pruned.push(tab)
            }
            else {
                remaining.push(tab)
            }
        })

        return [pruned, remaining]
    }

    pruneTabs(tabs) {
        tabs.forEach(tab => {
            chrome.tabs.remove(tab.id, () => {
                var error = chrome.runtime.lastError

                if (error) {
                   console.error(error)
                }
            })
        })
    }
}

export {
    TabPruner
}