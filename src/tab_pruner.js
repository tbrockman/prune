class TabPruner {
    constructor (tabTracker, interval, threshold) {
        this.tabTracker = tabTracker
        this.interval = interval
        this.threshold = threshold
    }

    start() {
        this.pruneTabs()
        setTimeout(this.start, this.interval)
    }

    pruneTabs() {
        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
                const tabShouldBePruned = this.tabTracker.tabShouldBePruned(tab.id, this.threshold)

                if (tabShouldBePruned) {
                    console.log('pruning tab: ', tab.id)
                    chrome.tabs.remove(tab.id, () => {
                        var error = chrome.runtime.lastError

                        if (error) {  
                           return console.error(error)
                        }
                    })
                }
            })
        })
    }
}

export {
    TabPruner
}