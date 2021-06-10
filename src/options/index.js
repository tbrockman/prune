const defaults = {
    'auto-deduplicate': true,
    'auto-prune': true,
    'prune-threshold': 7,
    'auto-group': true,
    'auto-group-threshold': 3,
    'auto-group-name': '🕒 old tabs',
    'auto-prune-bookmark': false,
    'auto-prune-bookmark-name': '🌱 pruned',
    'tab-lru-enabled': true,
    'tab-lru-size': 10,
    'tab-lru-destination': 'group'
}

const getOptions = (callback) => {
    chrome.storage.sync.get(defaults, callback)
}

const getOptionsAsync = async() => {
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

const setOption = (key, value, callback) => {
    chrome.storage.sync.set({[key]: value}, callback)
}

const setOptionAsync = async (key, value) => {
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
    getOptions,
    setOption,
    getOptionsAsync,
    setOptionAsync
}