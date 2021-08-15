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

    it('shouldnt do anything if lock cannot be acquired', async () => {
        tabLock.add(1)
        await tabDeduplicator.deduplicateTab({ id: 1 })
        assert(chrome.tabs.query.notCalled)
    })

    it('shouldnt do anything if opening blank new tab', async () => {
        await tabDeduplicator.deduplicateTab({ id: 1, 'url':'chrome://newtab/'})
        assert(chrome.tabs.query.notCalled)
    })

    it('shouldnt do anything if not opening new tab', async () => {
        await tabDeduplicator.deduplicateTab({ id: 1, url:'theo.lol'})
        assert(chrome.tabs.query.notCalled)
    })

    it('should deduplicate tab', async () => {
        chrome.tabs.query.resolves([{ id: 2, url:'theo.lol'}])
        await tabDeduplicator.deduplicateTab({ id: 1, url:'theo.lol', status: 'loading'})
        assert(chrome.tabs.highlight.calledOnceWith)
        assert(chrome.windows.update.calledOnce)
        assert(chrome.tabs.remove.calledOnce)
    })
})