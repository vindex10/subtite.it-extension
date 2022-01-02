/* global fetch */

'use strict'

const SERVER_NAME = 'http://localhost:5000'

async function postData (url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return await response.json()
}

async function getData (url) {
  const response = await fetch(url, {
    method: 'GET'
  })
  return await response.json()
}

async function getSupportedLangs () {
  return await getData(SERVER_NAME + '/subtitle/langs')
}

async function getUserProfile () {
  return await getData(SERVER_NAME + '/profile')
}

async function sendUserAuth (signInData) {
  postData(SERVER_NAME + '/auth', signInData)
}

export { postData, getData, getSupportedLangs, getUserProfile, sendUserAuth }
