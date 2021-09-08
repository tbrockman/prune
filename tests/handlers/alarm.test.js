// TODO

import { AlarmHandler } from '../../src/handlers/alarm'
import { assert } from 'chai'
import { TabBookmarker, TabGrouper, TabPruner, TabTracker } from '../../src/tabs';

const chrome = require('sinon-chrome/extensions');

describe('alarm-handler', () => {

    let handler
    let tracker
    let grouper
    let pruner
    let bookmarker

    before(() => {
        global.chrome = chrome
        global.chrome.flush()
    })

    const createAlarmHandler = (options) => {
        tracker = new TabTracker()
        grouper = new TabGrouper()
    
        if (options['auto-prune-bookmark']) {
            bookmarker = new TabBookmarker(options['auto-prune-bookmark-name'])
        }
        pruner = new TabPruner(bookmarker)
        handler = new AlarmHandler({ tracker, grouper, pruner, options })
    }

    afterEach(() => {
        global.chrome.flush()
    })

    it('shouldnt remove or group any tabs', async() => {

    })

    it('should remove but not group tabs', async() => {

    })

    it('should group but not remove tabs', async() => {

    })
})