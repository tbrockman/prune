import { TabPruner } from '../../src/tabs/tab-pruner'
import { assert } from 'chai';

const chrome = require('sinon-chrome/extensions');

describe('tab-pruner', () => {

    let tabPruner

    before(() => {
        global.chrome = chrome
        global.chrome.flush()
    })

    beforeEach(() => {
        tabPruner = new TabPruner()
    })

    afterEach(() => {
        global.chrome.flush()
    })

    it('should prune tabs', async () => {
        const tabs = [
            {
                id: 1,
            },
            {
                id: 2
            },
            {
                id: 3
            }
        ]
        chrome.tabs.remove.resolves()
        await tabPruner.pruneTabs(tabs)
        assert.equal(chrome.tabs.remove.callCount, 3)
    })

    it('should catch errors', async() => {
        const tabs = [
            {
                id: 1,
            },
            {
                id: 2
            },
            {
                id: 3
            }
        ]
        chrome.tabs.remove.rejects()
        await tabPruner.pruneTabs(tabs)
        assert.equal(chrome.tabs.remove.callCount, 3)
    })
})