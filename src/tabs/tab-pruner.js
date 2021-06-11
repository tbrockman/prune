class TabPruner {

    constructor () {
        this.pruneTabs = this.pruneTabs.bind(this)
    }

    async pruneTabs(tabs) {
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