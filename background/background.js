/* global browser */

'use strict'

const AppState = {}
AppState._STATE = {
  enabled: true
}
AppState.save = async function () {
  await browser.storage.sync.set({ settings: AppState._STATE })
}
AppState.restore = async function () {
  const response = await browser.storage.sync.get({ settings: AppState._STATE })
  AppState._STATE = response.settings
}

AppState.update = function (settingType, newValue) {
  if (settingType === 'subtitles_enabled') {
    return AppState.updateEnabled(newValue)
  }
  throw new Error('Setting type is not supported', settingType)
}

AppState.get = function (settingType) {
  if (settingType === 'subtitles_enabled') {
    return AppState.getEnabled()
  }
  throw new Error('Setting type is not supported', settingType)
}

AppState.getEnabled = function () {
  return AppState._STATE.enabled
}

AppState.updateEnabled = function (value) {
  const newVal = !!value
  AppState._STATE.enabled = newVal
  return newVal
}

const MessagingAPI = {}
MessagingAPI.updateSettings = function (settingTypeToValue) {
  for (const [settingType, newValue] of Object.entries(settingTypeToValue)) {
    AppState.update(settingType, newValue)
  }
  AppState.save().then()
}
MessagingAPI.getSettings = function (settingTypes) {
  const res = {}
  for (const settingType of settingTypes) {
    res[settingType] = AppState.get(settingType)
  }
  return res
}

function messageHandler (request, sender, sendResponse) {
  let data
  if (request.action === 'update_settings') {
    data = MessagingAPI.updateSettings(request.data)
  } else if (request.action === 'get_settings') {
    data = MessagingAPI.getSettings(request.data)
  } else {
    return false
  }
  const response = { status: 200 }
  if (data !== undefined) {
    response.data = data
  }
  sendResponse(response)
  return true
}

AppState.restore().then(() => {
  browser.runtime.onMessage.addListener(messageHandler)
})
