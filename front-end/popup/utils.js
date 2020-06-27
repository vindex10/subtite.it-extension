"use strict";

export {callOnActiveTab}

async function callOnActiveTab(callback) {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        for (var tab of tabs) {
            callback(tab);
        }
    })
}
