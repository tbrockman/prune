// TODO: extract common code
import { localStorage } from '~util/storage';
import { type PruneStorage } from '~util/storage';
import { type Tab } from '../types';

type TabTrackerOptions = {
	tabsStorageKey: string;
	storage: PruneStorage;
};

class TabTracker {
	tabsStorageKey: string;
	tabs: Map<string, number>;
	storage: PruneStorage;

	constructor({ tabsStorageKey = 'tabs', storage = localStorage }: Partial<TabTrackerOptions> = {}) {
		this.tabsStorageKey = tabsStorageKey;
		this.storage = storage;
		this.tabs = new Map();
		this.init = this.init.bind(this);
		this.saveStateAsync = this.saveStateAsync.bind(this);
		this.loadStateAsync = this.loadStateAsync.bind(this);
		this.trackTabs = this.trackTabs.bind(this);
		this.filterClosedTabs =
			this.filterClosedTabs.bind(this);
		this.getTabLastViewed = this.getTabLastViewed.bind(this);
		this.remove = this.remove.bind(this);
		this.track = this.track.bind(this);
	}

	async init(openTabs: Tab[]) {
		console.debug('initializing tracker');
		const tabs = await this.loadStateAsync(this.tabsStorageKey);

		if (tabs.size === 0) {
			console.debug('no loaded tabs found in storage');
		} else {
			this.tabs = tabs;
			console.debug('loaded tabs found in storage', tabs);
		}
		await this.trackNewOpenTabs(openTabs);
		console.debug('resolved tab state', this.tabs);
	}

	limitNumberOfVisibleTabs(tabs: Tab[], limit: number): [Tab[], Tab[]] {
		// order the tabs we're given by their position in our tracked map
		const orderBy = new Map<string, number>();
		let index = 0;
		this.tabs.forEach((val, key) => {
			// sort in descending order
			orderBy.set(key, this.tabs.size - index - 1);
			index += 1;
		});
		const sorted = tabs.sort(
			(a, b) =>
				(orderBy.get(a.url ?? '') ?? 0) - (orderBy.get(b.url ?? '') ?? 0),
		);
		// slice [0,limit) for visible, [limit+1 - tabs.length) for hidden
		const visible = sorted.slice(0, limit);
		const hidden = sorted.slice(limit, tabs.length);

		return [visible, hidden];
	}

	findTabsExceedingThreshold(tabs: Tab[], threshold: number): [Tab[], Tab[]] {
		const exceeds: Tab[] = [];
		const remaining: Tab[] = [];

		tabs.forEach((tab) => {
			const now = Date.now();
			const lastViewed = this.getTabLastViewed(tab.url ?? '') ?? now;
			const passesThreshold = now - lastViewed >= threshold;

			if (passesThreshold) {
				exceeds.push(tab);
			} else {
				remaining.push(tab);
			}
		});
		return [exceeds, remaining];
	}

	getTabLastViewed(tabUrl: string): number | undefined {
		return this.tabs.get(tabUrl);
	}

	getTabLastViewedWithDefault(tabUrl: string, def: number = 0) {
		return this.tabs.get(tabUrl) ?? def;
	}

	async trackTabs(tabs: Tab[]) {
		await Promise.all(
			tabs.map(async (tab) => {
				await this.track(tab, false);
			}),
		);
		await this.saveStateAsync(this.tabsStorageKey)
		console.debug('done tracking tabs');
	}

	async trackNewOpenTabs(openTabs: Tab[]) {
		await Promise.all(
			openTabs.map(async (tab) => {
				if (tab.url) {
					if (!this.tabs.has(tab.url)) {
						await this.track(tab, false);
					}
				}
			}),
		);
		await this.saveStateAsync(this.tabsStorageKey)
	}

	async filterClosedTabs(openTabs: Tab[]) {
		const openTabSet: Set<string> = new Set();
		console.debug('currently open tabs when filtering: ', openTabs);

		openTabs.map((tab) => {
			if (tab.url) {
				openTabSet.add(tab.url);
			}
		})

		console.debug('open tabs set: ', openTabSet);

		this.tabs.forEach((val, key) => {
			if (!openTabSet.has(key)) {
				console.debug('removing non-open tab', key);
				this.remove(key);
			}
		});
		await this.saveStateAsync(this.tabsStorageKey);
	}

	remove(tabUrl: string) {
		if (this.tabs.has(tabUrl)) {
			this.tabs.delete(tabUrl);
		}
		return;
	}

	async track(tab: Tab, saveImmediately = true) {
		if (tab.url) {
			console.debug('tracking tab', tab.url);

			if (this.tabs.has(tab.url)) {
				this.tabs.delete(tab.url);
			}
			this.tabs.set(tab.url, new Date().getTime());

			try {
				saveImmediately && await this.saveStateAsync(this.tabsStorageKey);
			} catch (error) {
				console.error(error);
			}
		} else {
			console.debug('tab has no url or is a special tab', tab);
		}
	}

	serializeTabs(tabs: Map<string, number>) {
		let serialized: [string, number][] = [];
		tabs.forEach((val, key) => {
			serialized.push([key, val]);
		});
		return JSON.stringify(serialized);
	}

	deserializeTabs(tabs: [string, number][]) {
		let deserialized = new Map<string, number>();
		console.debug('deserializing tabs', tabs, 'typeof tabs', typeof tabs);
		tabs.forEach(([url, date]: [string, number]) => {
			deserialized.set(url, date);
		});
		return deserialized;
	}

	async saveStateAsync(key: string) {
		const serialized = this.serializeTabs(this.tabs);
		console.debug('saving state', key, serialized);
		try {
			await this.storage.set(key, serialized);
		} catch (error) {
			console.debug('error saving state', error);
		}
		console.debug('saved state');
	}

	async loadStateAsync(key: string) {
		const data: any = await this.storage.get(key);
		console.debug('got local storage data', data);

		if (data) {
			console.debug('deserializing data', data);
			return this.deserializeTabs(JSON.parse(data));
		}
		return new Map();
	}
}

export default TabTracker;
