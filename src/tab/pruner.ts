import { type Tab } from '../types';
import TabBookmarker from './bookmarker';

class TabPruner {
	bookmarker: TabBookmarker;

	constructor(bookmarker: TabBookmarker) {
		this.bookmarker = bookmarker;
		this.pruneTabs = this.pruneTabs.bind(this);
	}

	async pruneTabs(tabs: Tab[]) {
		console.debug('pruning tabs', tabs);

		if (tabs.length == 0) return;

		this.bookmarker.bookmarkTabs(tabs);

		const tabIds: number[] = tabs
			.filter((tab) => tab.id !== null && tab.id !== undefined)
			.map((tab) => tab.id);

		try {
			await chrome.tabs.remove(tabIds);
		} catch (error) {
			console.error(error);
		}
	}
}

export default TabPruner;
