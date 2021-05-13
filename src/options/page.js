import { getOptions, setOption } from './index.js'

class OptionsPage {

    constructor() {
        this.initializeAutoDeduplicateInput()
        this.initializeAutoPruneInputs()
        this.initializeAutoGroupInputs()
        this.initializeDefaultValues()
    }

    initializeAutoDeduplicateInput() {
        this.autoDeduplicateCheckbox = document.getElementById('auto-deduplicate-checkbox')
        this.autoDeduplicateCheckbox.addEventListener('change', (e) => {
            setOption('auto-deduplicate', e.target.checked, () => {})
        })
    }

    initializeAutoPruneInputs() {
        this.autoPruneCheckbox = document.getElementById('auto-prune-checkbox')
        this.autoPruneThreshold = document.getElementById('auto-prune-threshold')
        this.autoPruneBookmarkCheckbox = document.getElementById('auto-prune-bookmark-checkbox')
        this.autoPruneBookmarkName= document.getElementById('auto-prune-bookmark-name')

        this.autoPruneCheckbox.addEventListener('change', (e) => {
            setOption('auto-prune', e.target.checked, () => {
                this.autoPruneThreshold.disabled = !e.target.checked
                this.autoPruneBookmarkCheckbox.disabled = !e.target.checked
            })
        })
        this.autoPruneThreshold.addEventListener('change' ,e=> {
            setOption('prune-threshold', parseFloat(e.target.value), () => {})
        })
        this.autoPruneBookmarkCheckbox.addEventListener('change', (e) => {
            setOption('auto-prune-bookmark', e.target.checked, () => {
                this.autoPruneBookmarkName.disabled = !e.target.checked
            })
        })
        this.autoPruneBookmarkName.addEventListener('input', e => {
            setOption('auto-prune-bookmark-name', e.input.value)
        })
    }

    initializeAutoGroupInputs() {
        this.autoGroupCheckbox = document.getElementById('auto-group-checkbox')
        this.autoGroupThreshold = document.getElementById('auto-group-threshold')
        this.autoGroupName = document.getElementById('auto-group-name')

        this.autoGroupCheckbox.addEventListener('change', (e) => {
            setOption('auto-group', e.target.checked, () => {
                this.autoGroupThreshold.disabled = !e.target.checked
                this.autoGroupName.disabled = !e.target.checked
            })
        })
        this.autoGroupThreshold.addEventListener('change', e => {
            setOption('auto-group-threshold', parseFloat(e.target.value), () => {})
        })
        this.autoGroupName.addEventListener('input', e => {
            setOption('auto-group-name', e.input.value)
        })
    }

    initializeDefaultValues() {
        getOptions(options => {
            this.autoDeduplicateCheckbox.checked = options['auto-deduplicate']
            this.autoPruneCheckbox.checked = options['auto-prune']
            this.autoPruneThreshold.disabled = !options['auto-prune']
            this.autoPruneThreshold.value = options['prune-threshold']
            this.autoGroupCheckbox.checked = options['auto-group']
            this.autoGroupThreshold.disabled = !options['auto-group']
            this.autoGroupThreshold.value = options['auto-group-threshold']
            this.autoGroupName.disabled = !options['auto-group']
            this.autoGroupName.value = options['auto-group-name']
            this.autoPruneBookmarkCheckbox.checked = options['auto-prune-bookmark']
            this.autoPruneBookmarkCheckbox.disabled = !options['auto-prune']
            this.autoPruneBookmarkName.disabled = !options['auto-prune-bookmark']
            this.autoPruneBookmarkName.value = options['auto-prune-bookmark-name']
        })
    }
}

const init = () => {
    const page = new OptionsPage()
}

window.addEventListener('load', init)