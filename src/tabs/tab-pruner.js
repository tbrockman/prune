import { getOptions } from '../options/index.js'

class TabPruner {
    constructor (tabTracker, interval, threshold) {
        this.tabTracker = tabTracker
        this.interval = interval
        this.pruneThreshold = threshold
        this.start = this.start.bind(this)
        this.pruneTabs = this.pruneTabs.bind(this)
        this.autoPrune = false

        getOptions(options => {
            this.autoPrune = options['auto-prune']
            this.pruneThreshold = options['prune-threshold'] * 24 * 60 * 60 * 1000
        })

        chrome.storage.onChanged.addListener(function(changes, namespace) {
            
            if (namespace == 'sync') {

                let change;

                if ('auto-prune' in changes) {
                    change = changes['auto-prune']
                    this.autoPrune = change.newValue
                }

                if ('prune-threshold' in changes) {
                    change = changes['prune-threshold']
                    this.pruneThreshold = change.newValue * 24 * 60 * 60 * 1000
                }
            }
        });
    }

    start() {
        this.pruneTabs()
        setTimeout(() => {
            this.start()
        }, this.interval)
    }

    pruneTabs() {

        if (!this.autoPrune) return

        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
                const tabShouldBePruned = this.tabTracker.tabShouldBePruned(tab.id, this.pruneThreshold)

                if (tabShouldBePruned) {

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