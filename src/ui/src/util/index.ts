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
	'auto-deduplicate' = true;
	'auto-prune' = true;
	'prune-threshold' = 7;
	'auto-group' = true;
	'auto-group-threshold' = 3;
	'auto-group-name' = '🕒 old tabs';
	'auto-prune-bookmark' = false;
	'auto-prune-bookmark-name' = '🌱 pruned';
	'tab-lru-enabled' = false;
	'tab-lru-size' = 30;
	'tab-lru-destination' = 'group';
	'show-hints' = true;
	'productivity-mode-enabled' = false;
	'productivity-suspend-domains' = ['youtube', 'facebook', 'instagram', 'reddit', 'tiktok', 'buzzfeed', 'amazon', 'netflix', 'news.ycombinator', 'hbomax'];
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
