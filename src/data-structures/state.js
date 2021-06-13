import { syncStorageGetAsync, syncStorageSetAsync } from '../util'

class State {

    constructor(state = {}, sync) {
        this.listeners = {}
        this.state = state
        this.sync = sync
    }

    get(key) {
        return this.state[key]
    }

    async init(defaults) {
        let options = defaults

        if (this.sync) {
            options = await syncStorageGetAsync(defaults)
        }

        for (const [key, value] of Object.entries(options)) {
            this.upsert(key, value)
        }
    }

    async upsert(key, value) {
        this.state[key] = value

        if (this.sync) {
            await syncStorageSetAsync(key, value)
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