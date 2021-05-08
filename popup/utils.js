/* global browser */

'use strict'

async function callOnActiveTab (callback, ...args) {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    for (var tab of tabs) {
      callback(tab, ...args)
    }
  })
}

export { callOnActiveTab }
