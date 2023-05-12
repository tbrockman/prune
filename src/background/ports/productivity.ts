import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';
import { StorageKeys } from '~enums';
import TabTracker from '~tab/tab-tracker';
import { getMatchingFilters, urlToPartialHref } from '~util/filter';

class ProductivityPortHandler {
	storage: Storage;
	tracker: TabTracker;

	constructor(storage: Storage, tracker: TabTracker) {
		this.storage = storage;
		this.tracker = tracker;
	}

	async handle(req, res) {
		console.debug('received req', req);
		let productiveTabs = await chrome.tabs.query({});
		await this.tracker.init(productiveTabs);
		const domainFilters = await this.storage.get<string[]>(
			StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS,
		);
		productiveTabs = productiveTabs.filter((tab) => {
			const url = new URL(tab.url);
			const partialHref = urlToPartialHref(url);
			const matchingFilters = getMatchingFilters(
				partialHref,
				domainFilters,
			);
			return matchingFilters.length == 0;
		});
		productiveTabs = productiveTabs.sort((a, b) => {
			return (
				this.tracker.getTabLastViewedWithDefault(a.url) -
				this.tracker.getTabLastViewedWithDefault(b.url)
			);
		});

		if (productiveTabs.length > 0) {
			console.debug(
				'focusing last productive tab',
				productiveTabs.at(-1),
			);
			chrome.tabs.update(productiveTabs.at(-1).id, { active: true });
		} else {
			console.debug('didnt find a productive tab to focus');
		}
		res.send({
			message: 'Hello from port handler',
		});
	}
}

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
	const storage = new Storage();
	const tracker = new TabTracker();
	const handler = new ProductivityPortHandler(storage, tracker);
	return handler.handle(req, res);
};

export default handler;
