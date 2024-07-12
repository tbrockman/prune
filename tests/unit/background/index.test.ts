import * as commandMod from '../../../src/listeners/command'
import * as installedMod from '../../../src/listeners/extension-installed'
import * as filterExemptMod from '../../../src/listeners/filter-exemption-alarm'
import * as tabAgeAlarmMod from '../../../src/listeners/tab-age-alarm'
import * as tabFocusedMod from '../../../src/listeners/tab-focused'
import * as tabUpdatedMod from '../../../src/listeners/tab-updated'

import sinon from 'sinon/pkg/sinon-esm';

declare var global: any;

const chrome = require('sinon-chrome/extensions');
const proxyquire = require('proxyquire').noCallThru();

describe('background script index', () => {
    let createCommandListener: sinon.SinonStub<typeof commandMod.createListener>;
    let createInstallListener: sinon.SinonStub<typeof installedMod.createListener>;
    let createFilterExemptionListener: sinon.SinonStub<typeof filterExemptMod.createListener>;
    let createTabAgeAlarmListener: sinon.SinonStub<typeof tabAgeAlarmMod.createListener>;
    let createTabFocusedListener: sinon.SinonStub<typeof tabFocusedMod.createListener>;
    let createTabUpdatedListener: sinon.SinonStub<typeof tabUpdatedMod.createListener>;
    let initLoggingStub: sinon.SinonStub

    before(() => {
        global.chrome = chrome;
    });

    beforeEach(() => {
        global.chrome.flush();
        createCommandListener = sinon.stub()
        createInstallListener = sinon.stub()
        createFilterExemptionListener = sinon.stub()
        createTabAgeAlarmListener = sinon.stub()
        createTabFocusedListener = sinon.stub()
        createTabUpdatedListener = sinon.stub()
        initLoggingStub = sinon.stub()

        createTabAgeAlarmListener.returns(async () => { })

        proxyquire('../../../src/background/index', {
            '~listeners/command': { createListener: createCommandListener },
            '~listeners/extension-installed': { createListener: createInstallListener },
            '~listeners/filter-exemption-alarm': { createListener: createFilterExemptionListener },
            '~listeners/tab-age-alarm': { createListener: createTabAgeAlarmListener },
            '~listeners/tab-focused': { createListener: createTabFocusedListener },
            '~listeners/tab-updated': { createListener: createTabUpdatedListener },
            '~util': { initLogging: initLoggingStub }
        })
    })

    it('should create alarm and handlers', async () => {
        sinon.assert.calledOnce(chrome.alarms.create);
        sinon.assert.calledTwice(chrome.alarms.onAlarm.addListener);
        sinon.assert.calledOnce(chrome.tabs.onUpdated.addListener);
        sinon.assert.calledOnce(chrome.runtime.onInstalled.addListener);
        sinon.assert.calledOnce(chrome.tabs.onActivated.addListener);
    })
})