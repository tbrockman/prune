const getOptions = (callback) => {
    const defaults = {
        'auto-prune': false,
        'prune-threshold': 14,
        'auto-group': true,
        'auto-group-threshold': 3,
        'auto-group-name': '🕒 old tabs'
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