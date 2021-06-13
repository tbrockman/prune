const localStorageGetAsync = async(key) => {
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

const localStorageSetAsync = async(items) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(items, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            }
            else {
                resolve()
            }
        })
    })
}

const syncStorageGetAsync = async (defaults) => {
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

const syncStorageSetAsync = async (key, value) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({[key]: value}, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            }
            else {
                resolve(value)
            }
        })
    })
}

export {
    localStorageGetAsync,
    localStorageSetAsync,
    syncStorageGetAsync,
    syncStorageSetAsync
}