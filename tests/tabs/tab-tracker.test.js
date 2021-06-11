import { TabTracker } from '../../src/tabs/tab-tracker'
import { assert } from 'chai';

const chrome = require('sinon-chrome/extensions');

describe('tab-tracker', () => {

    let tabTracker

    before(() => {
        global.chrome = chrome
        global.chrome.flush()
    })

    beforeEach(() => {
        tabTracker = new TabTracker()
    })

    afterEach(() => {
        global.chrome.flush()
    })

    it('should initialize empty tab state', async () => {
        chrome.storage.local.get.callsArgWith(1, { tabs: {}})
        await tabTracker.init([])
        assert.equal(0, Object.keys(tabTracker.tabs).length)
    })

    it('should initialize populated tab state with no stored information', async () => {
        const tabs = [
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ]
        chrome.storage.local.get.callsArgWith(1, { tabs: {}})
        await tabTracker.init(tabs)
        assert.equal(Object.keys(tabTracker.tabs).length, 3)
    })

    it('should replace loaded local storage tab state', async () => {
        const tabs = {
            1: new Date().toString(),
            2: new Date().toString(),
            3: new Date().toString()
        }
        chrome.storage.local.get.callsArgWith(1, { tabs: tabs})
        await tabTracker.init([])
        assert.equal(Object.keys(tabTracker.tabs).length, 0)
    })

    it('should consolidate existing tab state with open tabs', async () => {
        const openTabs = [
            { id: 1 }
        ]
        const storedTabs = {
            1: new Date().toString(),
            2: new Date().toString(),
            3: new Date().toString()
        }
        chrome.storage.local.get.callsArgWith(1, {tabs: storedTabs})
        chrome.storage.local.set.callsArgWith(1, {})
        await tabTracker.init(openTabs)
        assert.equal(Object.keys(tabTracker.tabs).length, 1)
        assert(tabTracker.tabs.hasOwnProperty(1))
        assert(chrome.storage.local.set.calledOnce)
    })

    it('should indicate tabs whose last viwed exceeds threshold', async () => {
        const openTabs = [
            { id: 1},
            { id: 2},
            { id: 3}
        ]
        const today = new Date()
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)
        const lastWeek = new Date()
        lastWeek.setDate(today.getDate() - 7)
        const storedTabs = {
            1: today.toString(),
            2: yesterday.toString(),
            3: lastWeek.toString()
        }
        chrome.storage.local.get.callsArgWith(1, {tabs: storedTabs})
        await tabTracker.init(openTabs)
        const [exceeds, remaining] = tabTracker.findTabsExceedingThreshold(openTabs, 42*60*60*1000)
        assert.isTrue(exceeds.length == 1)
        assert.equal(exceeds[0].id, 3)
        assert.isTrue(remaining.length == 2)
    })
})