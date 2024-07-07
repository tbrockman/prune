import * as tabGrouperModule from '../../../src/tab/grouper'
import * as tabPrunerModule from '../../../src/tab/pruner'
import * as tabTrackerModule from '../../../src/tab/tracker'
import * as tabDeduplicatorModule from '../../../src/tab/deduplicator'
import * as tabBookmarkerModule from '../../../src/tab/bookmarker'
import * as alarmModule from '../../../src/handlers/alarm'

import sinon from 'sinon/pkg/sinon-esm';
import type { SinonStubbedInstance } from 'sinon'
import { SyncStorageKeys } from '~enums'
import { SyncKeyValues as Options } from '~util/storage'

declare var global: any;

const chrome = require('sinon-chrome/extensions');
const proxyquire = require('proxyquire').noCallThru();

describe('background script', () => {
    let TabGrouper: SinonStubbedInstance<tabGrouperModule.default>;
    let TabPruner: SinonStubbedInstance<tabPrunerModule.default>;
    let TabTracker: SinonStubbedInstance<tabTrackerModule.default>;
    let TabDeduplicator: SinonStubbedInstance<tabDeduplicatorModule.default>;
    let TabBookmarker: SinonStubbedInstance<tabBookmarkerModule.default>;
    let AlarmHandler: SinonStubbedInstance<alarmModule.default>;
    let alarmHandlerStub: sinon.SinonStub
    let getOptionsAsyncStub: sinon.SinonStub
    let initLoggingStub: sinon.SinonStub

    before(() => {
        global.chrome = chrome;
    });

    beforeEach(() => {
        global.chrome.flush();
        TabGrouper = sinon.stub().callsFake(() => sinon.createStubInstance(tabGrouperModule.default))
        TabPruner = sinon.stub().callsFake(() => sinon.createStubInstance(tabPrunerModule.default))
        TabTracker = sinon.stub().callsFake(() => sinon.createStubInstance(tabTrackerModule.default))
        TabDeduplicator = sinon.stub().callsFake(() => sinon.createStubInstance(tabDeduplicatorModule.default))
        TabBookmarker = sinon.stub().callsFake(() => sinon.createStubInstance(tabBookmarkerModule.default))
        AlarmHandler = sinon.stub().callsFake(() => alarmHandlerStub = sinon.createStubInstance(alarmModule.default))
        const options = new Options()
        options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK] = true
        options[SyncStorageKeys.AUTO_PRUNE_BOOKMARK_NAME] = 'a'
        getOptionsAsyncStub = sinon.stub().resolves(options)
        initLoggingStub = sinon.stub()
    })

    it('should create alarm and handlers', async () => {
        proxyquire('../../../src/background/index', {
            '~handlers/alarm': AlarmHandler,
            '~tab/grouper': TabGrouper,
            '~tab/pruner': TabPruner,
            '~tab/tracker': TabTracker,
            '~tab/deduplicator': TabDeduplicator,
            '~tab/bookmarker': TabBookmarker,
            '~util': { getOptionsAsync: getOptionsAsyncStub, initLogging: initLoggingStub }
        })

        sinon.assert.calledOnce(chrome.alarms.create);
        sinon.assert.calledOnce(chrome.alarms.onAlarm.addListener);
        sinon.assert.calledOnce(chrome.tabs.onUpdated.addListener);
        sinon.assert.calledOnce(chrome.runtime.onInstalled.addListener);
        sinon.assert.calledOnce(chrome.tabs.onActivated.addListener);
    })

    it('alarm listener should execute alarm handler', async () => {
        proxyquire('../../../src/background/index', {
            '~handlers/alarm': AlarmHandler,
            '~tab/grouper': TabGrouper,
            '~tab/pruner': TabPruner,
            '~tab/tracker': TabTracker,
            '~tab/deduplicator': TabDeduplicator,
            '~tab/bookmarker': TabBookmarker,
            '~util/storage': { SyncKeyValues: Options, getSyncStorage: getOptionsAsyncStub },
            '~util': { initLogging: initLoggingStub }
        })

        let alarmListener = chrome.alarms.onAlarm.addListener.getCall(0).args[0]
        await alarmListener()

        // TODO: meaningful assertions
        sinon.assert.calledOnce(TabGrouper)
        sinon.assert.calledOnce(TabPruner)
        sinon.assert.calledOnce(TabTracker)
        sinon.assert.calledOnce(TabBookmarker)
        sinon.assert.calledOnce(AlarmHandler)
        sinon.assert.calledOnce(getOptionsAsyncStub)
        sinon.assert.calledOnce(initLoggingStub)
        sinon.assert.calledOnce(alarmHandlerStub.execute)
    })
})