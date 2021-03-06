'use strict'

import * as Utils from './utils.js' // {callOnActiveTab}
import * as User from './user.js' // {currentUser}
import * as Actions from './actions.js' // {triggerEdit}

async function initRouter () {
  const authPopUp = document.querySelector('#popup-auth')
  const logInPopUp = document.querySelector('#popup-login')
  const landIngPopUp = document.querySelector('#popup-landing')
  const profilePopUp = document.querySelector('#popup-profile')
  const profileTriggerEdit = document.querySelector('#popup-profile .triggerEdit')
  const AuthPageLink = document.querySelector('.header__auth-link')
  const loginPageLink = document.querySelector('.header__login-link')
  const backHomePageLink = document.querySelector('.header__back-link')
  const backHome = document.querySelector('.back-link')

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
  backHomePageLink.addEventListener('click', goBackHandler)
  backHome.addEventListener('click', goBackHandler)
}

async function onLogin () {
  document.querySelector('#popup-auth').style.display = 'none'
  document.querySelector('#popup-login').style.display = 'none'
  document.querySelector('#popup-landing').style.display = 'none'
  document.querySelector('#popup-profile').style.display = 'block'
  document.querySelector('#popup-profile .header__logo-title').innerHTML = 'Hello, ' + (User.currentUser().full_name || User.currentUser().username) + '!'
}

export { initRouter, onLogin }
