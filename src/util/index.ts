import { Features, config } from '../config';
import { StorageKeys } from '~enums';
import { localStorage, syncStorage } from './storage';
export { pollTabForStatus } from './query';
export { initLogging } from './logging';

class Options implements Record<StorageKeys, any> {
	[StorageKeys.AUTO_DEDUPLICATE] = true;
	[StorageKeys.AUTO_DEDUPLICATE_CLOSE] = true;
	[StorageKeys.AUTO_PRUNE] = true;
	[StorageKeys.AUTO_PRUNE_THRESHOLD] = config.featureSupported(Features.TabGroups) ? 7 : 4;
	[StorageKeys.AUTO_GROUP] = true;
	[StorageKeys.AUTO_GROUP_THRESHOLD] = 2;
	[StorageKeys.AUTO_GROUP_NAME] = '🕒 old tabs';
	[StorageKeys.AUTO_PRUNE_BOOKMARK] = true;
	[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME] = '🌱 pruned';
	[StorageKeys.TAB_LRU_ENABLED] = false;
	[StorageKeys.TAB_LRU_SIZE] = 16;
	[StorageKeys.TAB_LRU_DESTINATION]: 'group' | 'close' = 'group';
	[StorageKeys.SHOW_HINTS] = true;
	[StorageKeys.PRODUCTIVITY_MODE_ENABLED] = false;
	[StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS] = config.productivity?.domains;
	[StorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS] = {};
	[StorageKeys.USE_SYNC_STORAGE] = false;
	[StorageKeys.PRODUCTIVITY_LAST_PRODUCTIVE_TAB] = 0;

	getStorage() {
		return this[StorageKeys.USE_SYNC_STORAGE] ? syncStorage : localStorage;
	}
}

const getOptionsAsync = async (): Promise<Options> => {
	const options = new Options();
	const raw = await syncStorage.getManyOrDefault(options);
	for (const key in raw) {
		options[key] = raw[key];
	}
	return options;
};

const setOptionAsync = async (key: keyof Options, value: any) => {
	return await syncStorage.set(key as string, value);
};

export { getOptionsAsync, setOptionAsync, Options };
