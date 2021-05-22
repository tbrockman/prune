class TabBookmarker {

    constructor(bookmarkFolderName) {
        this.bookmarkFolderName = bookmarkFolderName
        this.bookmarkTabs = this.bookmarkTabs.bind(this)
    }

    async bookmarkTabs(tabs) {
        const bookmarks = await chrome.bookmarks.search({title: this.bookmarkFolderName})
        let folder
        console.log(bookmarks)

        if (bookmarks.length == 0) {
            folder = await chrome.bookmarks.create({title: this.bookmarkFolderName})
        }
        else {
            folder = bookmarks[0]
        }

        await tabs.forEach(async tab => {
            await chrome.bookmarks.create({title: tab.title, url: tab.url, parentId: folder.id})
        })
    }
}

export {
    TabBookmarker
}