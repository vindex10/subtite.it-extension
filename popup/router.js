'use strict'

import * as Utils from './utils.js' // {callOnActiveTab, getSettings}
import * as User from './user.js' // {currentUser}
import * as UI from './ui.js' // {setSubtitlesSwitchEnabled, setSubtitlesSwitchDisabled}
import * as Actions from './actions.js' // {triggerEdit, toggleSubtitles}

async function initRouter () {
  const authPopUp = document.querySelector('#popup-auth')
  const logInPopUp = document.querySelector('#popup-login')
  const landIngPopUp = document.querySelector('#popup-landing')
  const profilePopUp = document.querySelector('#popup-profile')
  const profileTriggerEdit = document.querySelector('#popup-profile .triggerEdit')
  const profileLogout = document.querySelector('#popup-profile .logout')
  const AuthPageLink = document.querySelector('.header__auth-link')
  const loginPageLink = document.querySelector('.header__login-link')
  const backHomePageLink = document.querySelector('.header__back-link')
  const backHome = document.querySelector('.back-link')
  const toggleSubtitlesSwitch = document.querySelector('#toggle-subtitles')

  async function goBackHandler () {
    landIngPopUp.style.display = 'block'
    authPopUp.style.display = 'none'
    logInPopUp.style.display = 'none'
    profilePopUp.style.display = 'none'
  }

  await goBackHandler()

  AuthPageLink.addEventListener('click', async () => {
    landIngPopUp.style.display = 'none'
    authPopUp.style.display = 'block'
    logInPopUp.style.display = 'none'
  })

  loginPageLink.addEventListener('click', async () => {
    landIngPopUp.style.display = 'none'
    authPopUp.style.display = 'none'
    logInPopUp.style.display = 'block'
  })

  profileTriggerEdit.addEventListener('click', async () => {
    await Utils.callOnActiveTab(Actions.triggerEdit)
  })
  profileLogout.addEventListener('click', goBackHandler)

  backHomePageLink.addEventListener('click', goBackHandler)
  backHome.addEventListener('click', goBackHandler)

  const subtitlesEnabled = (await Utils.getSettings(['subtitles_enabled'])).subtitles_enabled
  if (subtitlesEnabled) {
    UI.setSubtitlesSwitchEnabled()
  } else {
    UI.setSubtitlesSwitchDisabled()
  }
  toggleSubtitlesSwitch.addEventListener('change', async (e) => {
    await Utils.callOnActiveTab(Actions.toggleSubtitles, e)
  })
}

async function onLogin () {
  document.querySelector('#popup-auth').style.display = 'none'
  document.querySelector('#popup-login').style.display = 'none'
  document.querySelector('#popup-landing').style.display = 'none'
  document.querySelector('#popup-profile').style.display = 'block'
  document.querySelector('#popup-profile .header__logo-title').innerHTML = 'Hello, ' + (User.currentUser().full_name || User.currentUser().username) + '!'
}

export { initRouter, onLogin }
