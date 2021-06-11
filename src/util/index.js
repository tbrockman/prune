const getAsync = async(key) => {
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

const setAsync = async(items) => {
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
    getAsync as localStorageGetAsync,
    setAsync as localStorageSetAsync
}