import { config } from '../config';
import { StorageKeys } from '~enums';
import { syncStorage } from './storage';
export { pollTabForStatus } from './query';
export { initLogging } from './logging';

class Options extends Map<StorageKeys, any> {
	[StorageKeys.AUTO_DEDUPLICATE] = true;
	[StorageKeys.AUTO_DEDUPLICATE_MERGE] = false;
	[StorageKeys.AUTO_PRUNE] = true;
	[StorageKeys.PRUNE_THRESHOLD] = 7;
	[StorageKeys.AUTO_GROUP] = true;
	[StorageKeys.AUTO_GROUP_THRESHOLD] = 1;
	[StorageKeys.AUTO_GROUP_NAME] = '🕒 old tabs';
	[StorageKeys.AUTO_PRUNE_BOOKMARK] = true;
	[StorageKeys.AUTO_PRUNE_BOOKMARK_NAME] = '🌱 pruned';
	[StorageKeys.TAB_LRU_ENABLED] = false;
	[StorageKeys.TAB_LRU_SIZE] = 16;
	[StorageKeys.TAB_LRU_DESTINATION] = 'group';
	[StorageKeys.SHOW_HINTS] = true;
	[StorageKeys.PRODUCTIVITY_MODE_ENABLED] = false;
	[StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS] = config.productivity?.domains;
	[StorageKeys.PRODUCTIVITY_SUSPEND_EXEMPTIONS] = {};
}

const defaults = new Options();

const getOptionsAsync = async (): Promise<Options> => {
	console.debug('getting options async');
	return (await syncStorage.getManyOrDefault(defaults)) as Options;
};

const setOptionAsync = async (key: keyof Options, value: any) => {
	return await syncStorage.set(key as string, value);
};

export { defaults, getOptionsAsync, setOptionAsync, Options };
