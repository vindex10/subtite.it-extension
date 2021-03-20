/* global browser */

// Split this file into smaller ones when you feel like it :)

'use strict'

import * as User from './user.js' // {Identity}
import * as Router from './router.js' // {onLogin}
import * as Requests from './requests.js' // {getVideoData, getUserProfile, sendUserAuth}

//
// Auth

async function initSignIn () {
  try {
    const res = await Requests.getUserProfile()
    if (res.username) {
      User.Identity.set(res)
      await Router.onLogin()
    }
  } catch {
    let signInData
    // TODO: trigger and intercept submit instead
    document.querySelector('#signin-form-submit').addEventListener('click', async (event) => {
      const username = document.querySelector('#useremail').value
      const password = document.querySelector('#password').value

      signInData = {
        username,
        password
      }

      try {
        await Requests.sendUserAuth(signInData)
        await new Promise(resolve => setTimeout(resolve, 1000)) // return user profile from post! race conditions
        const res = await Requests.getUserProfile()
        if (res.username) {
          User.Identity.set(res)
          await Router.onLogin()
        }
      } catch {
        console.log('Auth failed')
      }
    })
  }
}

//
// TriggerEdit

async function getAndPreparePhrases (uri) {
  const phrases = await Requests.getVideoData(uri)

  const phrasesExtended = [...phrases]
  phrasesExtended.unshift({ data: 'Script starts here:', ref: 9000 })
  phrasesExtended.push({ data: 'The end of the script.', ref: 9000 })

  const sortedPhrases = []
  for (let i = 0; i < phrases.length; i++) {
    if (Object.prototype.hasOwnProperty.call(phrases[i], 'editable')) {
      sortedPhrases.push({ ...phrasesExtended[i - 1] })
      sortedPhrases.push({ ...phrasesExtended[i] })
      sortedPhrases.push({ ...phrasesExtended[i + 1] })
      break
    }
  }
  return sortedPhrases
}

async function triggerEdit (activeTab) {
  let sortedPhrases
  try {
    sortedPhrases = await getAndPreparePhrases(activeTab.url)
  } catch (error) {
    console.log('Failed to get phrases:', error)
  }
  await browser.tabs.sendMessage(activeTab.id, { action: 'triggerEdit', sortedPhrases: sortedPhrases })
}

export { initSignIn, triggerEdit }
