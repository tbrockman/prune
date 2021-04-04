import { getOptions, setOption } from './index.js'

class OptionsPage {

    constructor() {
        this.initializeAutoPruneInputs()
        this.initializeAutoGroupInputs()
        this.initializeDefaultValues()
    }

    initializeAutoPruneInputs() {
        this.autoPruneCheckbox = document.getElementById('auto-prune-checkbox')
        this.autoPruneThreshold = document.getElementById('auto-prune-threshold')

        this.autoPruneCheckbox.addEventListener('change', (e) => {
            setOption('auto-prune', e.target.checked, () => {
                this.autoPruneThreshold.disabled = !e.target.checked
            })
        })
        this.autoPruneThreshold.addEventListener('change' ,e=> {
            setOption('prune-threshold', parseFloat(e.target.value), () => {})
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
            this.autoPruneCheckbox.checked = options['auto-prune']
            this.autoPruneThreshold.disabled = !options['auto-prune']
            this.autoPruneThreshold.value = options['prune-threshold']
            this.autoGroupCheckbox.checked = options['auto-group']
            this.autoGroupThreshold.disabled = !options['auto-group']
            this.autoGroupThreshold.value = options['auto-group-threshold']
            this.autoGroupName.disabled = !options['auto-group']
            this.autoGroupName.value = options['auto-group-name']
        })
    }
}

const init = () => {
    const page = new OptionsPage()
}

window.addEventListener('load', init)