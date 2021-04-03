import { TabDeduplicator } from '../../src/tabs/tab-deduplicator'
import { assert } from 'chai';

const chrome = require('sinon-chrome/extensions');

describe('tab-deduplicator', () => {

    let tabDeduplicator
    let tabLock

    beforeEach(() => {
        global.chrome = chrome
        tabLock = new Set()
        tabDeduplicator = new TabDeduplicator(tabLock)
    })

    it('shouldnt do anything if lock cannot be acquired', () => {
        tabLock.add(1)
        tabDeduplicator.deduplicateTab({ id: 1 })
        assert(chrome.tabs.query.notCalled)
    })

    it('shouldnt do anything if opening blank new tab', () => {
        tabDeduplicator.deduplicateTab({ id: 1, 'url':'chrome://newtab/'})
        assert(chrome.tabs.query.notCalled)
    })

    it('shouldnt do anything if not opening new tab', () => {
        tabDeduplicator.deduplicateTab({ id: 1, url:'theo.lol'})
        assert(chrome.tabs.query.notCalled)
    })

    it('should deduplicate tab', () => {
        chrome.tabs.query.callsArgWith(1, [{ id: 2, url:'theo.lol'}])
        tabDeduplicator.deduplicateTab({ id: 1, url:'theo.lol', status: 'loading'})
        assert(chrome.tabs.highlight.calledOnceWith)
        assert(chrome.windows.update.calledOnce)
        assert(chrome.tabs.remove.calledOnce)
    })
})