import { TabPruner } from '../../src/tabs/tab-pruner'
import sinon from "../../node_modules/sinon/pkg/sinon-esm.js";

const chrome = require('sinon-chrome/extensions');

describe('tab-pruner', () => {

    let tabPruner

    before(() => {
        global.chrome = chrome
        const mockTracker = {
            track: () => {},
            getTabLastViewed: () => {}
        }
        tabPruner = new TabPruner(chrome, mockTracker, 3600, 3600)
    })

    it('should pass', () => {

    })
})