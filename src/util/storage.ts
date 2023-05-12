export async function syncStorageSetAsync(key: string, value: any) {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.set({ [key]: value }, () => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(value);
			}
		});
	});
}

export async function syncStorageGetAsync(defaults: any): Promise<any> {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(defaults, (items) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(items);
			}
		});
	});
}

export async function localStorageSetAsync(items: any) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set(items, () => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(items);
			}
		});
	});
}

export async function localStorageGetAsync(key: string): Promise<any> {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(key, (items) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(items);
			}
		});
	});
}
