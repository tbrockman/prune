const pollTabForStatus = async (tab: chrome.tabs.Tab, status: string, timeout: number): Promise<chrome.tabs.Tab> => {
    return new Promise((resolve, reject) => {

        let rejectTimer;

        const poll = setInterval(async () => {
            const updatedTab = await chrome.tabs.get(tab.id);
            if (updatedTab.status === status) {
                clearTimeout(rejectTimer);
                clearInterval(poll);
                resolve(updatedTab);
            }
        }, 30);

        rejectTimer = setTimeout(() => {
            clearInterval(poll);
            reject('Tab status not updated before timeout');
        }, timeout)
    });
}

export {
    pollTabForStatus
}
