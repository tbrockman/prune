import { config } from '../config';
import { StorageKeys } from '~enums';
import {
	syncStorageSetAsync,
	syncStorageGetAsync,
	localStorageGetAsync,
	localStorageSetAsync,
} from './storage';

class Options {
	[StorageKeys.AUTO_DEDUPLICATE] = true;
	[StorageKeys.AUTO_PRUNE] = true;
	[StorageKeys.PRUNE_THRESHOLD] = 7;
	[StorageKeys.AUTO_GROUP] = true;
	[StorageKeys.AUTO_GROUP_THRESHOLD] = 2;
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
