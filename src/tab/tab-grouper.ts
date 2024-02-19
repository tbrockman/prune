import { type Tab } from '../types';

class TabGrouper {
	enabled: boolean;

	constructor(enabled: boolean = true) {
		this.groupTabs = this.groupTabs.bind(this);
		this.enabled = enabled;
	}

	async groupTabs(tabs: Tab[], groupProperties: any) {
		if (!this.enabled) return;

		let tabIds = tabs.reduce((acc, tab) => {
			if (tab.groupId == -1 && tab.id) {
				acc.push(tab.id);
			}
			return acc;
		}, [] as number[]);

		if (tabIds.length == 0) return;

		console.debug('grouping tabs', tabIds);

		const groups = await chrome.tabGroups.query({
			title: groupProperties['title'],
		});

		console.debug('groups found async: ', groups);

		const index = groups.findIndex(
			(e) => e.title == groupProperties['title'],
		);

		// If the group already exists, just use that
		if (index > -1) {
			await chrome.tabs.group({
				tabIds: tabIds,
				groupId: groups[index].id,
			});
		}
		// Otherwise, create a new one
		else {
			try {
				const groupId = await chrome.tabs.group({ tabIds });
				await chrome.tabGroups.update(groupId, groupProperties);
				await chrome.tabGroups.move(groupId, { index: -1 });
			} catch (err) {
				console.error(err);
			}
		}
	}
}

export default TabGrouper;
