'use strict'

import * as Requests from './requests.js' // {getSupportedLangs}
import * as Utils from './utils.js' // {getSettings}

function setSubtitlesSwitchEnabled () {
  document.querySelector('#toggle-subtitles').checked = true
  document.querySelector('.toggle-subtitles-container label').innerHTML = 'Subtitles enabled'
}

function setSubtitlesSwitchDisabled () {
  document.querySelector('#toggle-subtitles').checked = false
  document.querySelector('.toggle-subtitles-container label').innerHTML = 'Subtitles disabled'
}

async function populateSupportedLangs () {
  const setNativeLangSelect = document.querySelector('#set-native-lang')
  const supportedLangs = await Requests.getSupportedLangs()
  const nativeLang = (await Utils.getSettings(['native_lang'])).native_lang
  setNativeLangSelect.innerHTML = ''
  for (const supportedLang of supportedLangs) {
    const el = document.createElement('option')
    el.value = supportedLang
    el.innerHTML = supportedLang
    el.selected = supportedLang === nativeLang
    console.log(el)
    setNativeLangSelect.appendChild(el)
  }
}

export { setSubtitlesSwitchEnabled, setSubtitlesSwitchDisabled, populateSupportedLangs }
