import { getOptions, setOption } from './index.js'

class OptionsPage {

    constructor() {
        this.autoPruneCheckbox = document.getElementById('auto-prune-checkbox')
        this.pruneIntervalInput = document.getElementById('prune-threshold-input')

        this.autoPruneCheckbox.addEventListener('change', (e) => {
            setOption('auto-prune', e.target.checked, () => {
                this.pruneIntervalInput.disabled = !e.target.checked
            })
        })

        this.pruneIntervalInput.addEventListener('change' ,e=> {
            setOption('prune-threshold', parseInt(e.target.value), () => {})
        })

        getOptions(options => {
            this.autoPruneCheckbox.checked = options['auto-prune']
            this.pruneIntervalInput.disabled = !options['auto-prune']
            this.pruneIntervalInput.value = options['prune-threshold']
        })
    }
}

const init = () => {
    const page = new OptionsPage()
}

window.addEventListener('load', init)