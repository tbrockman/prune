import type { PlasmoMessaging } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'
import { StorageKeys } from '~enums'
import TabTracker from '~tab/tracker'
import { getMatchingFilters } from '~util/filter'
import { config as _config, type PruneConfig } from '~config'

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
		let productiveTabs = await chrome.tabs.query({})
		await this.tracker.init(productiveTabs)
		let domainFilters = await this.storage.get<string[]>(
			StorageKeys.PRODUCTIVITY_SUSPEND_DOMAINS,
		)

		if (domainFilters == undefined) {
			domainFilters = this.config.productivity.domains
		}
		productiveTabs = productiveTabs.filter((tab) => {
			const matchingFilters = getMatchingFilters(
				new URL(tab.url),
				domainFilters,
			)
			return matchingFilters.length == 0
		})
		productiveTabs = productiveTabs.sort((a, b) => {
			return (
				this.tracker.getTabLastViewedWithDefault(a.url) -
				this.tracker.getTabLastViewedWithDefault(b.url)
			)
		})

		if (productiveTabs.length > 0) {
			console.debug(
				'focusing last productive tab',
				productiveTabs.at(-1),
			)
			chrome.tabs.update(productiveTabs.at(-1).id, { active: true })
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
