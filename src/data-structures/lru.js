class LRU {

    constructor(cache = new Set(), capacity = 10) {
        this.cache = cache;
        this.capacity = capacity;
    }

    has(value) {
        return this.cache.has(value)
    }

    add(value) {
        let evicted = []

        if (this.cache.has(value)) this.cache.delete(value);
        // evict oldest
        while (this.cache.size >= this.capacity) {
            const evictee = this.first()
            evicted.push(evictee)
            this.cache.delete(evictee);
        }
        this.cache.add(value)

        return evicted
    }

    delete(value) {
        this.cache.delete(value)
    }

    first() {
        return this.cache.keys().next().value;
    }

    serialize() {
        return JSON.stringify(this, replacer);
    }

    static deserialize(string) {
        return JSON.parse(string, reviver)
    }
}

// https://stackoverflow.com/a/56150320 (with some of my modifications)
// Credit @ https://stackoverflow.com/users/696535/pawel

function replacer(key, value) {
    if (value instanceof LRU) {
        return {
            dataType: 'LRU',
            value: Array.from(value.cache.values()),
            capacity: value.capacity
        };
    } else {
        return value;
    }
}

function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'LRU') {
            return new LRU(new Set(value.value), value.capacity);
        }
    }
    return value;
}

export default LRU