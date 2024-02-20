

const initLogging = () => {
    // Hackily disable info/log/debug logging in production
    if (process.env.NODE_ENV === 'production') {
        console.debug = () => { }
        console.log = () => { }
        console.info = () => { }
    }
}

export {
    initLogging
}
