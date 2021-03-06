import { TabPruner } from '../../src/tabs/tab-pruner'
import sinon from "../../node_modules/sinon/pkg/sinon-esm.js";
import { assert } from 'chai';

const chrome = require('sinon-chrome/extensions');

describe('tab-pruner', () => {

    let tabPruner
    let mockTracker

    beforeEach(() => {
        global.chrome = chrome
        mockTracker = {
            track: sinon.stub(),
            getTabLastViewed: sinon.stub()
        }
        tabPruner = new TabPruner(mockTracker)
    })

    it('should find one tab to prune', () => {
        const tabs = [
            {
                id: 1,
            }
        ]

        const threshold = 1000 * 60 * 60 * 24

        const expired = new Date()
        expired.setDate(expired.getDate() - 2)
        mockTracker.getTabLastViewed.returns(expired)
        const [pruned, remaining] = tabPruner.findTabsToPrune(tabs, threshold)
        assert.equal(pruned.length, 1)
        assert.equal(remaining.length, 0)
    })

    it('should find all tabs prunable', () => {
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

        const [pruned, remaining] = tabPruner.findTabsToPrune(tabs, threshold)
        assert.equal(pruned.length, 3)
        assert.equal(0, remaining.length)
    })

    it('should find no tabs to prune', () => {
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

        const [pruned, remaining] = tabPruner.findTabsToPrune(tabs, threshold)
        assert.equal(pruned.length, 0)
        assert.equal(remaining.length, 3)
    })

    it('should find some tabs to prune', () => {
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

        const [pruned, remaining] = tabPruner.findTabsToPrune(tabs, threshold)
        assert.equal(pruned.length, 2)
        assert.equal(remaining.length, 1)
    })
})