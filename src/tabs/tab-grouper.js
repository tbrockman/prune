class TabGrouper {

    constructor() {
        this.groupTabs = this.groupTabs.bind(this)
    }

    async groupTabs(tabs, groupProperties) {
        let tabIds = tabs.reduce((acc, tab) => {
            console.debug('acc', acc, tab)
            if (tab.groupId == -1) {
                acc.push(tab.id)
            }
            return acc
        }, [])

        console.debug('found tabids to group after reduce: ', tabIds)

        if (tabIds.length == 0) return

        console.debug('grouping tabs async', tabIds)

        const groups = await chrome.tabGroups.query({title: groupProperties["title"]})

        console.debug('groups found async: ', groups)

        const index = groups.findIndex((e) => e.title == groupProperties["title"])

        // If the group already exists, just use that
        if (index > -1) {
            await chrome.tabs.group({
                tabIds: tabIds,
                groupId: groups[index].id
            })
        }
        // Otherwise, create a new one
        else {
            const groupId = await chrome.tabs.group({tabIds})
            chrome.tabGroups.update(groupId, groupProperties)
            chrome.tabGroups.move(groupId, {index: 0})
        }
    }
}

export {
    TabGrouper
}