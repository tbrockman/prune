enum StorageKeys {
	AUTO_DEDUPLICATE = 'auto-deduplicate',
	AUTO_DEDUPLICATE_CLOSE = 'auto-deduplicate-close',
	AUTO_PRUNE = 'auto-prune',
	PRUNE_THRESHOLD = 'prune-threshold',
	AUTO_GROUP = 'auto-group',
	AUTO_GROUP_THRESHOLD = 'auto-group-threshold',
	AUTO_GROUP_NAME = 'auto-group-name',
	AUTO_PRUNE_BOOKMARK = 'auto-prune-bookmark',
	AUTO_PRUNE_BOOKMARK_NAME = 'auto-prune-bookmark-name',
	TAB_LRU_ENABLED = 'tab-lru-enabled',
	TAB_LRU_SIZE = 'tab-lru-size',
	TAB_LRU_DESTINATION = 'tab-lru-destination',
	SHOW_HINTS = 'show-hints',
	PRODUCTIVITY_MODE_ENABLED = 'productivity-mode-enabled',
	PRODUCTIVITY_SUSPEND_DOMAINS = 'productivity-suspend-domains',
	PRODUCTIVITY_SUSPEND_EXEMPTIONS = 'productivity-suspend-exemptions',
	PRODUCTIVITY_LAST_PRODUCTIVE_TAB = 'productivity-last-productive-tab',
}

enum Ports {
	PRODUCTIVITY = 'productivity',
}

export { StorageKeys, Ports };
