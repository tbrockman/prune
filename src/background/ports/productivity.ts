import type { PlasmoMessaging } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'
import { SyncStorageKeys } from '~enums'
import TabTracker from '~tab/tracker'
import { getMatchingFilters } from '~util/filter'
import { config as _config, type PruneConfig } from '~util/config'

class ProductivityPortHandler {
	storage: Storage
	tracker: TabTracker
	config: PruneConfig

	constructor(storage: Storage, tracker: TabTracker, config: PruneConfig = _config) {
		this.storage = storage
		this.tracker = tracker
		this.config = config
	}

	async handle(req, res) {
		console.debug('received req', req)
		let openTabs = await chrome.tabs.query({})
		await this.tracker.init(openTabs)
		let domainFilters = await this.storage.get<string[]>(
			SyncStorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS,
		)

		if (domainFilters == undefined) {
			domainFilters = this.config.productivity.domains
		}
		const extensionUrlPrefix = chrome.runtime.getURL('')
		console.debug('extensionUrlPrefix', extensionUrlPrefix)
		openTabs = openTabs.filter((tab) => {
			const matchingFilters = getMatchingFilters(
				new URL(tab.url),
				domainFilters,
			)
			return matchingFilters.length == 0 && !tab.url.startsWith(extensionUrlPrefix)
		})
		openTabs = openTabs.sort((a, b) => {
			return (
				this.tracker.getTabLastViewedWithDefault(a.url) -
				this.tracker.getTabLastViewedWithDefault(b.url)
			)
		})

		if (openTabs.length > 0) {
			console.debug(
				'focusing last productive tab',
				openTabs.at(-1),
			)
			chrome.tabs.update(openTabs.at(-1).id, { active: true })
		} else {
			console.debug('didnt find a productive tab to focus')
		}
		res.send({})
	}
}

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
	const storage = new Storage()
	const tracker = new TabTracker()
	const handler = new ProductivityPortHandler(storage, tracker)
	return handler.handle(req, res)
}

export default handler
