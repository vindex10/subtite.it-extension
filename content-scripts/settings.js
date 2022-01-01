/* global browser, Utils */

'use strict'

const Settings = {}

Settings.KEY_MOD = { ctrl: 0, shift: 1, alt: 2, meta: 3 }

Settings.UInterface = {}
Settings.UInterface.submitEditKey = 'Enter'
Settings.UInterface.submitEditKeyMods = [Settings.KEY_MOD.ctrl]

Settings.getSettings = async function (settings) {
  let response
  while (!response) {
    response = await browser.runtime.sendMessage({ action: 'get_settings', data: settings })
    Utils.asyncWait(50)
  }
  if (response.status !== 200) {
    throw new Error()
  }
  return response.data
}
