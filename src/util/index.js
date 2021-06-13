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

export {
    localStorageGetAsync,
    localStorageSetAsync
}