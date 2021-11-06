'use strict'

function setSubtitlesSwitchEnabled () {
  document.querySelector('#toggle-subtitles').checked = true
  document.querySelector('.toggle-label-container .toggle-label').innerHTML = 'Subtitles enabled'
}

function setSubtitlesSwitchDisabled () {
  document.querySelector('#toggle-subtitles').checked = false
  document.querySelector('.toggle-label-container .toggle-label').innerHTML = 'Subtitles disabled'
}

export { setSubtitlesSwitchEnabled, setSubtitlesSwitchDisabled }
