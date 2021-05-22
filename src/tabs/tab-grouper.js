class TabGrouper {

    constructor(tabTracker) {
        this.tabTracker = tabTracker
        this.groupTabs = this.groupTabs.bind(this)
    }

    groupTabs(tabs, groupProperties, threshold, callback = () => {}) {

        var tabIds = []

        tabs.forEach(tab => {
            const lastViewed = this.tabTracker.getTabLastViewed(tab.id)
            const now = Date.now()

            if (!lastViewed) {
                this.tabTracker.track(tab.id)
                lastViewed = now
            }
            const shouldBeGrouped = (now - lastViewed >= threshold) && tab.groupId == -1

            if (shouldBeGrouped) {
                tabIds.push(tab.id)
            }
        })

        if (tabIds.length == 0) return

        console.debug('grouping tabs', tabIds)

        chrome.tabGroups.query({title: groupProperties["title"]}, (groups) => {

            const index = groups.findIndex((e) => e.title == groupProperties["title"])

            // If the group already exists, just use that

            if (index > -1) {
                chrome.tabs.group({
                    tabIds: tabIds,
                    groupId: groups[index].id
                }, () => {
                    const error = chrome.runtime.lastError

                    if (error) {
                        console.error(error)
                    }
                    return callback(error)
                })
            }
            // Otherwise, create a new one
            else {
                chrome.tabs.group({
                    tabIds: tabIds
                }, (groupId) => {
                    const error = chrome.runtime.lastError

                    if (error) {
                        console.error(error)
                    }
                    else {
                        chrome.tabGroups.update(groupId, groupProperties)
                        chrome.tabGroups.move(groupId, {index: 0})
                        return callback(null)
                    }
                })
            }
        })
    }
}

export {
    TabGrouper
}