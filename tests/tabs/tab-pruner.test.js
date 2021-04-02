import { TabPruner } from '../../src/tabs/tab-pruner'
import sinon from "../../node_modules/sinon/pkg/sinon-esm.js";
import { assert } from 'chai';

const chrome = require('sinon-chrome/extensions');

describe('tab-pruner', () => {

    let tabPruner
    let mockTracker

    before(() => {
        global.chrome = chrome
        mockTracker = {
            track: sinon.stub(),
            getTabLastViewed: sinon.stub()
        }
        tabPruner = new TabPruner(mockTracker)
    })

    it('should prune one tab', () => {
        const tabs = [
            {
                id: 1,
            }
        ]

        const threshold = 1000 * 60 * 60 * 24

        const expired = new Date()
        expired.setDate(expired.getDate() - 2)
        mockTracker.getTabLastViewed.returns(expired)

        const remaining = tabPruner.pruneTabs(tabs, threshold)
        assert.equal(0, remaining.length)
    })

    it('should prune all tabs', () => {
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

        const threshold = 1000 * 60 * 60 * 24

        const expired = new Date()
        expired.setDate(expired.getDate() - 2)
        mockTracker.getTabLastViewed.returns(expired)

        const remaining = tabPruner.pruneTabs(tabs, threshold)
        assert.equal(0, remaining.length)
    })

    it('should prune no tabs', () => {
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

        const threshold = 1000 * 60 * 60 * 25

        const notExpired = new Date()
        notExpired.setDate(notExpired.getDate() - 1)
        mockTracker.getTabLastViewed.returns(notExpired)

        const remaining = tabPruner.pruneTabs(tabs, threshold)
        assert.equal(3, remaining.length)
    })

    it('should prune some tabs', () => {
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

        const threshold = 1000 * 60 * 60 * 24

        const expired = new Date()
        expired.setDate(expired.getDate() - 2)

        const notExpired = new Date()
        mockTracker.getTabLastViewed.returns(notExpired)
        mockTracker.getTabLastViewed.withArgs(1).returns(expired)
        mockTracker.getTabLastViewed.withArgs(2).returns(expired)

        const remaining = tabPruner.pruneTabs(tabs, threshold)
        assert.equal(1, remaining.length)
    })
})