/* global browser */

'use strict'

async function callOnActiveTab (callback, ...args) {
  const tabs = await browser.tabs.query({ currentWindow: true, active: true })
  for (const tab of tabs) {
    callback(tab, ...args)
  }
}

async function getSettings (settings) {
  const response = await browser.runtime.sendMessage({ action: 'get_settings', data: settings })
  if (response.status !== 200) {
    throw new Error()
  }
  return response.data
}

export { callOnActiveTab, getSettings }
