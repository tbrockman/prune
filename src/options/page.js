import { TipClient } from '../clients/tip.js'
import State from '../data-structures/state.js'
import { defaults } from './index.js'

class OptionsPage {

    constructor(tipClient) {
        this.tipClient = tipClient
        this.init()
    }

    async init() {
        this.state = new State(defaults, true)
        this.initializeAutoDeduplicateInput()
        this.initializeAutoGroupInputs()
        this.initializeAutoPruneInputs()
        this.initializeTabLRUInputs()
        this.initializeAutoPruneBookmarkInputs()
        this.initializeTipButton()
        this.state.init()
    }

    initializeAutoDeduplicateInput() {
        this.autoDeduplicateCheckbox = document.getElementById('auto-deduplicate-checkbox')
        this.state.registerListener('auto-deduplicate', (value) => {
            this.autoDeduplicateCheckbox.checked = value
        })
        this.autoDeduplicateCheckbox.addEventListener('change', async e => {
            await this.state.upsert('auto-deduplicate', e.target.checked)
        })
    }

    initializeAutoGroupInputs() {
        this.autoGroupCheckbox = document.getElementById('auto-group-checkbox')
        this.autoGroupThreshold = document.getElementById('auto-group-threshold')
        this.autoGroupName = document.getElementById('auto-group-name')

        this.state.registerListener('auto-group', (bool) => {
            this.autoGroupThreshold.disabled = !bool
            this.autoGroupName.disabled = !bool
            this.autoGroupCheckbox.checked = bool
        })
        this.state.registerListener('auto-group-threshold', (value) => {
            this.autoGroupThreshold.value = value
        })
        this.state.registerListener('auto-group-name', (value) => {
            this.autoGroupName.value = value
        })

        this.autoGroupCheckbox.addEventListener('change', async e => {
            await this.state.upsert('auto-group', e.target.checked)
        })
        this.autoGroupThreshold.addEventListener('change', async e => {
            await this.state.upsert('auto-group-threshold', parseFloat(e.target.value))
        })
        this.autoGroupName.addEventListener('input', async e => {
            await this.state.upsert('auto-group-name', e.target.value)
        })
    }

    autoPruneBookmarkCheckboxListener() {
        const tabLRUEnabled = this.state.get('tab-lru-enabled')
        const tabLRUDestination = this.state.get('tab-lru-destination')
        const autoPruneEnabled = this.state.get('auto-prune')
        const autoPruneBookmark = this.state.get('auto-prune-bookmark')

        this.autoPruneBookmarkCheckbox.disabled = 
            !autoPruneEnabled && !(tabLRUEnabled && tabLRUDestination == 'remove')
        this.autoPruneBookmarkName.disabled = this.autoPruneBookmarkCheckbox.disabled || !autoPruneBookmark
    }

    initializeAutoPruneInputs() {
        this.autoPruneCheckbox = document.getElementById('auto-prune-checkbox')
        this.autoPruneThreshold = document.getElementById('auto-prune-threshold')

        this.state.registerListener('auto-prune', (enabled) => {
            this.autoPruneCheckbox.checked = enabled
            this.autoPruneThreshold.disabled = !enabled
        })
        this.state.registerListener('prune-threshold', (value) => {
            this.autoPruneThreshold.value = value
        })
        this.autoPruneCheckbox.addEventListener('change', async e => {
            await this.state.upsert('auto-prune', e.target.checked)
        })
        this.autoPruneThreshold.addEventListener('change' ,async e => {
            await this.state.upsert('prune-threshold', parseFloat(e.target.value))
        })
    }

    initializeTabLRUInputs() {
        this.tabLRUCheckbox = document.getElementById('tab-lru-checkbox')
        this.tabLRUDestinationSelect = document.getElementById('tab-lru-destination')
        this.tabLRUSizeInput = document.getElementById('tab-lru-size-input')

        this.state.registerListener('tab-lru-enabled', (enabled) => {
            this.tabLRUCheckbox.checked = enabled
            this.tabLRUDestinationSelect.disabled = !enabled
            this.tabLRUSizeInput.disabled = !enabled
        })
        this.state.registerListener('tab-lru-destination', (dest) => {
            this.tabLRUDestinationSelect.value = dest
        })
        this.state.registerListener('tab-lru-size', (size) => {
            this.tabLRUSizeInput.value = size
        })

        this.tabLRUCheckbox.addEventListener('change', async e => {
            await this.state.upsert('tab-lru-enabled', e.target.checked)
        })
        this.tabLRUDestinationSelect.addEventListener('change', async e => {
            await this.state.upsert('tab-lru-destination', e.target.value)
        })
        this.tabLRUSizeInput.addEventListener('change', async e => {
            console.log('here', e.target.value)
            await this.state.upsert('tab-lru-size', parseInt(e.target.value))
        })
    }

    initializeAutoPruneBookmarkInputs() {
        this.autoPruneBookmarkCheckbox = document.getElementById('auto-prune-bookmark-checkbox')
        this.autoPruneBookmarkName= document.getElementById('auto-prune-bookmark-name')

        this.state.registerListener('tab-lru-enabled', () => this.autoPruneBookmarkCheckboxListener())
        this.state.registerListener('tab-lru-destination', () => this.autoPruneBookmarkCheckboxListener())
        this.state.registerListener('auto-prune', () => this.autoPruneBookmarkCheckboxListener())
        this.state.registerListener('auto-prune-bookmark', (enabled) => {
            this.autoPruneBookmarkCheckbox.checked = enabled
            this.autoPruneBookmarkName.disabled = !enabled
        })
        this.state.registerListener('auto-prune-bookmark-name', (name) => {
            this.autoPruneBookmarkName.value = name
        })

        this.autoPruneBookmarkCheckbox.addEventListener('change', async e => {
            await this.state.upsert('auto-prune-bookmark', e.target.checked)
        })
        this.autoPruneBookmarkName.addEventListener('input', async e => {
            await this.state.upsert('auto-prune-bookmark-name', e.input.value)
        })
    }

    isValidTip(tip) {
        return tip > 1.00
    }

    convertToCents(dollars) {
        return Math.floor(dollars * 100)
    }

    initializeTipButton() {
        this.tipButton = document.getElementById('tip-button')
        this.tipInput = document.getElementById('tip-input')
        this.tipButton.addEventListener('click', async (e) => {
            const tip = this.tipInput.value

            if (this.isValidTip(tip)) {
                this.setTipButtonLoading(true)
                const cents = this.convertToCents(tip)
                try {
                    const session = await this.tipClient.createSession(cents)
                    chrome.tabs.create({ url: session.url });
                    //await this.stripeClient.redirectToCheckout({ sessionId: session.id });
                }
                finally {
                    this.setTipButtonLoading(false)
                }
            }
        })
    }

    setTipButtonLoading(loading) {
        
        if (loading) {
            this.tipButton.classList.add('loading')
        }
        else {
            this.tipButton.classList.remove('loading')
        }
    }
}

const init = () => {
    const config = {
        local: {
            tip: {
                backend: 'http://127.0.0.1:8787'
            }
        },
        dev: {
            tip: {
                backend: 'https://tip.dev.theo.lol'
            }
        },
        prod: {
            tip: {
                backend: 'https://tip.theo.lol'
            }
        }
    }
    // TODO: dont be lazy and actually do some sort of build-time replacement of this
    const env = 'prod'
    const tipClient = new TipClient(config[env].tip.backend)
    const page = new OptionsPage(tipClient)
}

window.addEventListener('load', init)
