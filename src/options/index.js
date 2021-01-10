const getOptions = (callback) => {
    const defaults = {
        'auto-prune': false,
        'prune-threshold': 5
    }
    chrome.storage.sync.get(defaults, callback)
}

const setOption = (key, value, callback) => {
    chrome.storage.sync.set({[key]: value}, callback)
}

export {
    getOptions,
    setOption
}