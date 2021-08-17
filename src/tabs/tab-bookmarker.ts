import { Tab } from "../types"

class TabBookmarker {

    bookmarkFolderName: string

    constructor(bookmarkFolderName: string) {
        this.bookmarkFolderName = bookmarkFolderName
        this.bookmarkTabs = this.bookmarkTabs.bind(this)
    }

    async bookmarkTabs(tabs: Tab[]) {
        const bookmarks = await chrome.bookmarks.search({title: this.bookmarkFolderName})
        let folder: chrome.bookmarks.BookmarkTreeNode

        if (bookmarks.length == 0) {
            folder = await chrome.bookmarks.create({title: this.bookmarkFolderName})
        }
        else {
            folder = bookmarks[0]
        }

        tabs.forEach(async tab => {
            await chrome.bookmarks.create({title: tab.title, url: tab.url, parentId: folder.id})
        })
    }
}

export {
    TabBookmarker
}