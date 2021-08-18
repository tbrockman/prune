import { TabTracker } from '../../src/tabs/tab-tracker'
import { assert } from 'chai'

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
        assert.equal(3, tabTracker.tabs.size)
    })

    it('should replace loaded local storage tab state', async () => {
        const tabs = {
            1: new Date().toString(),
            2: new Date().toString(),
            3: new Date().toString()
        }
        chrome.storage.local.get.callsArgWith(1, { tabs: tabs})
        chrome.storage.local.set.callsArgWith(1, {})
        await tabTracker.init([])
        assert.equal(0, tabTracker.tabs.size)
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
        assert.equal(1, tabTracker.tabs.size)
        assert(tabTracker.tabs.has(1))
        assert(chrome.storage.local.set.calledOnce)
    })

    it('should retain existing tab state with tabs still open', async () => {
        const openTabs = [
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ]
        const storedTabs = {
            1: new Date().toString(),
            2: new Date().toString(),
            3: new Date().toString()
        }
        chrome.storage.local.get.callsArgWith(1, {tabs: storedTabs})
        chrome.storage.local.set.callsArgWith(1, {})
        await tabTracker.init(openTabs)
        assert.equal(3, tabTracker.tabs.size)
        assert(tabTracker.tabs.has(1))
        assert(tabTracker.tabs.has(2))
        assert(tabTracker.tabs.has(3))
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
        chrome.storage.local.set.callsArgWith(1, {})
        await tabTracker.init(openTabs)
        const [exceeds, remaining] = tabTracker.findTabsExceedingThreshold(openTabs, 42*60*60*1000)
        assert.isTrue(exceeds.length == 1)
        assert.equal(exceeds[0].id, 3)
        assert.isTrue(remaining.length == 2)
    })

    it('should reorder internal map on tab track', async() => {
        chrome.storage.local.get.callsArgWith(1, {tabs: []})
        chrome.storage.local.set.callsArgWith(1, {})
        await tabTracker.init([])
        await tabTracker.track({id: 1})
        await tabTracker.track({id: 2})
        let trackedTabs = Array.from(tabTracker.tabs.entries())
        assert.equal(1, trackedTabs[0][0])
        assert.equal(2, trackedTabs[1][0])
        await tabTracker.track({id: 1})
        trackedTabs = Array.from(tabTracker.tabs.entries())
        assert.equal(2, trackedTabs[0][0])
        assert.equal(1, trackedTabs[1][0])
    })

    // TODO
    it('should be able to track state across sessions', async () => {
        const openTabs = [
            { id: 1, url: 'a' },
            { id: 2, url: 'b' },
            { id: 3, url: 'c' }
        ]

        const stored = {
            'a': [4],
            'b': [5],
            'c': [6]
        }
    })

    it('should return a list of tabs to show and tabs to hide given a visible limit', async() => {
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
        const storedTabs = new Map([
            [3, lastWeek],
            [2, yesterday],
            [1, today]
        ])
        chrome.storage.local.get.callsArgWith(1, {tabs: JSON.stringify(Array.from(storedTabs.entries()))})
        chrome.storage.local.set.callsArgWith(1, {})
        await tabTracker.init(openTabs)
        const limitTabs = [{id: 1}, {id:2}]
        const [visible, hidden] = tabTracker.limitNumberOfVisibleTabs(limitTabs, 1)
        assert.equal(1, visible.length)
        assert.equal(1, hidden.length)
        assert.equal(1, visible[0].id)
        assert.equal(2, hidden[0].id)
    })

    it('should return a list of tabs to show and tabs to hide given a visible limit (without stored state)', async() => {
        const openTabs = []
        chrome.storage.local.get.callsArgWith(1, {tabs: []})
        chrome.storage.local.set.callsArgWith(1, {})
        await tabTracker.init(openTabs)
        await tabTracker.track({id: 2})
        await tabTracker.track({id: 1})
        await tabTracker.track({id: 3})
        await tabTracker.track({id: 4})

        const limitTabs = [{id: 1}, {id:2}, {id:3}, {id:4}]
        const [visible, hidden] = tabTracker.limitNumberOfVisibleTabs(limitTabs, 2)
        assert.equal(2, visible.length)
        assert.equal(2, hidden.length)
        assert.equal(4, visible[0].id)
        assert.equal(3, visible[1].id)
        assert.equal(1, hidden[0].id)
        assert.equal(2, hidden[1].id)
    })
})