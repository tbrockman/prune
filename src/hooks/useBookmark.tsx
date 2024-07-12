import { useEffect, useState } from "react";

export type Bookmarks = {
    folders: chrome.bookmarks.BookmarkTreeNode[]
    bookmarks: chrome.bookmarks.BookmarkTreeNode[]
}

const sortBookmarkNodes = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
    return nodes.sort((a, b) => {
        if (a?.dateGroupModified && b?.dateGroupModified) {
            return b.dateGroupModified - a.dateGroupModified
        } else if (a?.dateGroupModified) {
            return -1
        } else if (b?.dateGroupModified) {
            return 1
        }
    })
}

const walk = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
    const folders = []
    const bookmarks = []

    while (nodes.length > 0) {
        const node = nodes.pop()

        if (node.children) {

            if (node.title) {
                folders.push(node)
            }
            nodes.push(...node.children)
        } else {
            bookmarks.push(node)
        }
    }
    return {
        folders: sortBookmarkNodes(folders),
        bookmarks: sortBookmarkNodes(bookmarks)
    }
}

export async function getBookmarks() {
    const tree = await chrome.bookmarks.getTree()
    return walk(tree)
}

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmarks>({ folders: [], bookmarks: [] })

    useEffect(() => {
        const listener = async () => {
            setBookmarks(await getBookmarks())
        }
        chrome.bookmarks.onCreated.addListener(listener)
        chrome.bookmarks.onRemoved.addListener(listener)
        chrome.bookmarks.onChanged.addListener(listener)

        listener()

        return () => {
            chrome.bookmarks.onCreated.removeListener(listener)
            chrome.bookmarks.onRemoved.removeListener(listener)
            chrome.bookmarks.onChanged.removeListener(listener)
        }
    }, [])

    return bookmarks;
}