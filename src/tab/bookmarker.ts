import { type Tab } from '../types';

class TabBookmarker {
	bookmarkFolderName: string;
	enabled: boolean;

	constructor(bookmarkFolderName: string, enabled: boolean = true) {
		this.enabled = enabled;
		this.bookmarkFolderName = bookmarkFolderName;
		this.bookmarkTabs = this.bookmarkTabs.bind(this);
	}

	async bookmarkTabs(tabs: Tab[]) {
		if (tabs.length == 0 || !this.enabled) return;

		try {
			console.debug('filtering tabs with existing bookmarks');

			const tabPromises = tabs.map(async (tab) => {
				const exists = await chrome.bookmarks.search({
					title: tab.title,
					url: tab.url,
				});

				return exists.length == 0 ? tab : null;
			})

			const bookmarkedTabs = await Promise.all(tabPromises);
			tabs = bookmarkedTabs.filter((tab) => tab != null);

			if (tabs.length == 0) return;

			console.debug('searching for existing bookmark folder');

			const bookmarks = await chrome.bookmarks.search({
				query: this.bookmarkFolderName,
			});

			let folder: chrome.bookmarks.BookmarkTreeNode;

			console.debug('found bookmarks', bookmarks);

			if (bookmarks.length == 0) {
				folder = await chrome.bookmarks.create({
					title: this.bookmarkFolderName,
				});
			} else {
				folder = bookmarks[0];
			}

			console.debug('bookmark folder', folder);

			let promises = tabs.map(async (tab) => {
				return await chrome.bookmarks.create({
					title: tab.title,
					url: tab.url,
					parentId: folder.id,
				});
			});
			let result = await Promise.all(promises);

			console.debug('bookmark creation result', result);

			return result;
		} catch (error) {
			console.error(error);
		}
	}
}

export default TabBookmarker;
