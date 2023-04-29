import { config } from '../config';
import { StorageKeys } from '~enums';

const localStorageGetAsync = async (key: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(key, (items) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(items);
			}
		});
	});
};

const localStorageSetAsync = async (items: any) => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set(items, () => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(items);
			}
		});
	});
};

const syncStorageGetAsync = async (defaults: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(defaults, (items) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(items);
			}
		});
	});
};

const syncStorageSetAsync = async (key: string, value: any) => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.set({ [key]: value }, () => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(value);
			}
		});
	});
};

class Options {
	[StorageKeys.AUTO_DEDUPLICATE] = true;
	[StorageKeys.AUTO_PRUNE] = true;
	[StorageKeys.PRUNE_THRESHOLD] = 7;
	[StorageKeys.AUTO_GROUP] = true;
	[StorageKeys.AUTO_GROUP_THRESHOLD] = 3;
	[StorageKeys.AUTO_GROUP_NAME] = '🕒 old tabs';
	[StorageKeys.AUTO_PRUNE_BOOKMARK] = true;
	[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME] = '🌱 pruned';
	[StorageKeys.TAB_LRU_ENABLED] = false;
	[StorageKeys.TAB_LRU_SIZE] = 30;
	[StorageKeys.TAB_LRU_DESTINATION] = 'group';
	[StorageKeys.SHOW_HINTS] = true;
	[StorageKeys.PRODUCTIVITY_MODE_ENABLED] = false;
	[StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS] = config.productivity?.domains;
	[StorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS] = {};
}

const defaults = new Options();

const getOptionsAsync = async (): Promise<Options> => {
	return await syncStorageGetAsync(defaults);
};

const setOptionAsync = async (key: string, value: any) => {
	return await syncStorageSetAsync(key, value);
};

export {
	defaults,
	getOptionsAsync,
	setOptionAsync,
	localStorageGetAsync,
	localStorageSetAsync,
	syncStorageGetAsync,
	syncStorageSetAsync,
	Options,
};
