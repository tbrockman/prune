import type { Storage } from '@plasmohq/storage';
import { type Tab } from '../types';
import { StorageKeys } from '~enums';
import { getMatchingFilters } from '~util/filter';

class TabSuspender {
	storage: Storage;

	constructor(storage: Storage) {
		this.storage = storage;
	}

	async onTabFocus(tab: Tab) {}

	onTabCreate(tab: Tab) {}
}

export default TabSuspender;
