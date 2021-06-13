import { syncStorageGetAsync, syncStorageSetAsync } from '../util'

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

const getOptionsAsync = async () => {
    return await syncStorageGetAsync(defaults)
}

const setOptionAsync = async (key, value) => {
    return await syncStorageSetAsync(key, value)
}

export {
    defaults,
    getOptionsAsync,
    setOptionAsync
}