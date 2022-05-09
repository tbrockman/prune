import { TipConfig } from "../config"

class TipClient {

    backend: string

    constructor({ backend }: TipConfig) {
        this.backend = backend
    }

    async createSession(tip: number) {
        let response = await fetch(this.backend, {
            method: 'post',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                tip: tip
            })
        })

        if (response.status !== 200) {
            const text = await response.text()
            throw new Error(text)
        }
        return await response.json()
    }
}

export {
    TipClient
}