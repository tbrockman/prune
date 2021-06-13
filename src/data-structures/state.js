import { getOptionsAsync, setOptionAsync } from '../options/index.js'

class State {

    constructor(state = {}, persist = false) {
        this.listeners = {}
        this.state = state
        this.persist = persist
    }

    get(key) {
        return this.state[key]
    }
    
    async init(defaults) {
        const options = await getOptionsAsync(defaults)

        for (const [key, value] of Object.entries(options)) {
            this.upsert(key, value)
        }
    }

    async upsert(key, value) {
        this.state[key] = value

        if (this.persist) {
            await setOptionAsync(key, value)
        }

        if (key in this.listeners) {
            this.listeners[key].forEach(listener => {
                listener(value)
            })
        }
    }

    registerListener(key, listener) {
        
        if (key in this.listeners) {
            this.listeners[key].push(listener)
        }
        else {
            this.listeners[key] = [listener]
        }
    }
}

export default State