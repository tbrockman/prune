const localStorageGetAsync = async (key: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (items) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            }
            else {
                resolve(items)
            }
        })
    })
}

const localStorageSetAsync = async (items: any) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(items, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            }
            else {
                resolve(items)
            }
        })
    })
}

const syncStorageGetAsync = async (defaults: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(defaults, (items) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            }
            else {
                resolve(items)
            }
        })
    })
}

const syncStorageSetAsync = async (key: string, value: any) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [key]: value }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            }
            else {
                resolve(value)
            }
        })
    })
}

interface Options {
    'auto-deduplicate': boolean,
    'auto-prune': boolean,
    'prune-threshold': number,
    'auto-group': boolean,
    'auto-group-threshold': number,
    'auto-group-name': string,
    'auto-prune-bookmark': boolean,
    'auto-prune-bookmark-name': string,
    'tab-lru-enabled': boolean,
    'tab-lru-size': number,
    'tab-lru-destination': string
}

const defaults = {
    'auto-deduplicate': true,
    'auto-prune': true,
    'prune-threshold': 7,
    'auto-group': true,
    'auto-group-threshold': 3,
    'auto-group-name': '🕒 old tabs',
    'auto-prune-bookmark': false,
    'auto-prune-bookmark-name': '🌱 pruned',
    'tab-lru-enabled': false,
    'tab-lru-size': 30,
    'tab-lru-destination': 'group'
} as Options

const getOptionsAsync = async (): Promise<Options> => {
    const what = await syncStorageGetAsync(defaults)
    console.log('what', what)
    return await syncStorageGetAsync(defaults) as Options
}

const setOptionAsync = async (key: string, value: any) => {
    return await syncStorageSetAsync(key, value)
}

export type {
    Options
}

export {
    defaults,
    getOptionsAsync,
    setOptionAsync,
    localStorageGetAsync,
    localStorageSetAsync,
    syncStorageGetAsync,
    syncStorageSetAsync
}