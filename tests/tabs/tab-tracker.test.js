import { TabTracker } from '../../src/tabs/tab-tracker'
import { assert } from 'chai';

const chrome = require('sinon-chrome/extensions');

describe('tab-tracker', () => {

    let tabTracker

    before(() => {
        global.chrome = chrome
    })

    beforeEach(() => {
        tabTracker = new TabTracker()
    })

    afterEach(() => {
        global.chrome.flush()
    })

    it('should initialize empty tab state', (done) => {
        chrome.tabs.query.callsArgWith(1, [])
        chrome.storage.local.get.callsArgWith(1, { tabs: {}})
        tabTracker.initialize(() => {
            assert.equal(0, Object.keys(tabTracker.tabs).length)
            done()
        })
    })

    it('should initialize populated tab state with no stored information', (done) => {
        const tabs = [
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ]
        chrome.tabs.query.callsArgWith(1, tabs)
        chrome.storage.local.get.callsArgWith(1, { tabs: {}})
        tabTracker.initialize(() => {
            assert.equal(Object.keys(tabTracker.tabs).length, 3)
            done()
        })
    })

    it('should load tab state from local storage', (done) => {
        const tabs = {
            1: new Date().toString(),
            2: new Date().toString(),
            3: new Date().toString()
        }
        chrome.tabs.query.callsArgWith(1, [])
        chrome.storage.local.get.callsArgWith(1, { tabs: tabs})
        tabTracker.initialize(() => {
            assert.equal(Object.keys(tabTracker.tabs).length, 0)
            done()
        })
    })

    it('should consolidate existing tab state with open tabs', (done) => {
        const openTabs = [
            { id: 1 }
        ]
        const storedTabs = {
            1: new Date().toString(),
            2: new Date().toString(),
            3: new Date().toString()
        }
        chrome.tabs.query.callsArgWith(1, openTabs)
        chrome.storage.local.get.callsArgWith(1, {tabs: storedTabs})
        chrome.storage.local.set.callsArgWith(1, {})
        tabTracker.initialize(() => {
            assert.equal(Object.keys(tabTracker.tabs).length, 1)
            assert(tabTracker.tabs.hasOwnProperty(1))
            assert(chrome.storage.local.set.calledOnce)
            done()
        })
    })
})