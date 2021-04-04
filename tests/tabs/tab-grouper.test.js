import { TabGrouper } from '../../src/tabs/tab-grouper'
import sinon from "../../node_modules/sinon/pkg/sinon-esm.js";
import { assert } from 'chai';

const chrome = require('sinon-chrome/extensions');

describe('tab-grouper', () => {

    let mockTracker
    let tabGrouper

    beforeEach(() => {
        global.chrome = chrome
        chrome.tabs.group = sinon.stub()
        chrome.tabGroups = {
            query: sinon.stub(),
            update: sinon.stub(),
            move: sinon.stub()
        }
        mockTracker = {
            getTabLastViewed: sinon.stub(),
            track: sinon.stub()
        }
        tabGrouper = new TabGrouper(mockTracker)
    })

    it('shouldnt group tabs', () => {
        const tabs = [{
            id: 1,
            groupId: -1
        }]
        const notExpired = new Date()
        mockTracker.getTabLastViewed.returns(notExpired)
        tabGrouper.groupTabs(tabs, {}, 1000 * 60 * 60 * 24)
        assert(chrome.tabGroups.query.notCalled)
    })

    it('shouldnt group already grouped tabs', () => {
        const tabs = [{
            id: 1,
            groupId: 1
        }]
        const expired = new Date()
        expired.setDate(expired.getDate() - 2)
        mockTracker.getTabLastViewed.returns(expired)
        assert(chrome.tabGroups.query.notCalled)
    })

    it('should group tabs under existing group', (done) => {
        const tabs = [
            {
                id: 1,
                groupId: -1
            },
            {
                id: 2,
                groupId: 1
            }
        ]
        const group = {
            title: 'old tabs'
        }
        const groups = [
            group,
            {
                id: 2,
                title: 'not old tabs'
            },
            {
                id: 3,
                title: 'mold tabs'
            }
        ]
        const expired = new Date()
        expired.setDate(expired.getDate() - 2)
        mockTracker.getTabLastViewed.returns(expired)
        chrome.tabGroups.query.callsArgWith(1, groups)
        chrome.tabs.group.callsArgWith(1, {})
        tabGrouper.groupTabs(tabs, group, 1000 * 60 * 60 * 24, () => {
            assert(chrome.tabs.group.calledOnce)
            const call = chrome.tabs.group.getCall(0)
            const groupArgs = call.args[0]
            assert.equal(groupArgs.tabIds.length, 1)
            assert.equal(groupArgs.tabIds[0], 1)
            assert.equal(groupArgs.groupId, group.id)
            assert(chrome.tabGroups.update.notCalled)
            done()
        })
    })

    it('should group tabs under a new group', (done) => {
        const tabs = [
            {
                id: 1,
                groupId: -1
            },
            {
                id: 2,
                groupId: -1
            },
            {
                id: 3,
                groupId: -1
            }
        ]
        const group = {
            title: 'old tabs'
        }
        const groups = [
            {
                id: 2,
                title: 'not old tabs'
            },
            {
                id: 3,
                title: 'mold tabs'
            }
        ]
        const expired = new Date()
        expired.setDate(expired.getDate() - 2)
        mockTracker.getTabLastViewed.returns(expired)
        chrome.tabGroups.query.callsArgWith(1, groups)
        chrome.tabs.group.callsArgWith(1, 1)
        tabGrouper.groupTabs(tabs, group, 1000 * 60 * 60 * 24, () => {
            assert(chrome.tabs.group.calledOnce)
            const call = chrome.tabs.group.getCall(0)
            const groupArgs = call.args[0]
            assert.equal(Object.keys(groupArgs).length, 1)
            assert.equal(groupArgs.tabIds.length, 3)
            assert(chrome.tabGroups.update.calledOnce)
            assert(chrome.tabGroups.move.calledOnce)
            done()
        })
    })
})