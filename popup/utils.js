/* global browser */

'use strict'

async function callOnActiveTab (callback, ...args) {
  const tabs = await browser.tabs.query({ currentWindow: true, active: true })
  for (const tab of tabs) {
    callback(tab, ...args)
  }
}

const asyncWait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function getSettings (settings) {
  let response
  while (!response) {
    response = await browser.runtime.sendMessage({ action: 'get_settings', data: settings })
    asyncWait(50)
  }
  if (response.status !== 200) {
    throw new Error()
  }
  return response.data
}

export { callOnActiveTab, asyncWait, getSettings }
