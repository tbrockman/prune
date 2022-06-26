import {
	TabTracker,
	TabPruner,
	TabDeduplicator,
	TabGrouper,
	TabBookmarker,
} from './tabs/index';
import AlarmHandler from './handlers/alarm';
import { getOptionsAsync } from './ui/src/util';
import TabCreatedHandler from './handlers/tab-created';
import TabFocusedHandler from './handlers/tab-focused';

const lock = new Set<number>();

chrome.runtime.onInstalled.addListener(async (details: any) => {
	if (details.reason == 'update') {
		const version = chrome.runtime.getManifest().version;
		let split = version.split('.');
		const major = parseInt(split[0]);
		split = details.previousVersion.split('.');
		const prevMajor = parseInt(split[0]);

		console.debug(
			'Updated from ' + details.previousVersion + ' to ' + version + '!',
		);

		if (major >= 3 && major > prevMajor) {
			await chrome.storage.local.clear();
		}
	}
});
chrome.alarms.create({ periodInMinutes: 1 });

// Ran every minute
chrome.alarms.onAlarm.addListener(async (alarm) => {
	let bookmarker;
	const options = await getOptionsAsync();
	const tracker = new TabTracker();
	const grouper = new TabGrouper();

	if (options['auto-prune-bookmark']) {
		bookmarker = new TabBookmarker(options['auto-prune-bookmark-name']);
	}
	const pruner = new TabPruner(bookmarker);
	const handler = new AlarmHandler({ tracker, grouper, pruner, options });
	await handler.execute();
});

// When a new tab might be created
chrome.tabs.onUpdated.addListener(async (tabId, updatedInfo, tab) => {
	console.debug('tab updated', updatedInfo, tab);

	// TODO: handle when updatedInfo is tab being ungrouped
	if (updatedInfo.status != 'loading') return;

	let bookmarker;
	const options = await getOptionsAsync();

	const tracker = new TabTracker();
	const grouper = new TabGrouper();

	if (options['auto-prune-bookmark']) {
		bookmarker = new TabBookmarker(options['auto-prune-bookmark-name']);
	}
	const pruner = new TabPruner(bookmarker);
	const deduplicator = new TabDeduplicator(lock);
	const handler = new TabCreatedHandler({
		tracker,
		grouper,
		pruner,
		deduplicator,
		options,
	});
	await handler.execute(tab);
});

// Whenever a tab comes into focus
chrome.tabs.onActivated.addListener(async (activeInfo) => {
	let bookmarker;

	const options = await getOptionsAsync();
	const tracker = new TabTracker();
	const grouper = new TabGrouper();

	if (options['auto-prune-bookmark']) {
		bookmarker = new TabBookmarker(options['auto-prune-bookmark-name']);
	}
	const pruner = new TabPruner(bookmarker);
	const handler = new TabFocusedHandler({
		tracker,
		grouper,
		pruner,
		options,
	});
	await handler.execute(activeInfo);
});
