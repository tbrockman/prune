const removeTrailingSlashes = (str: string) => {
    while (str.endsWith('/')) {
        str = str.slice(0, -1);
    }
    return str;
}

export {
    removeTrailingSlashes
}