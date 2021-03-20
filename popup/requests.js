/* global fetch */

'use strict'

const SERVER_NAME = 'https://localhost:5000'

async function getVideoData (videoLink) {
  const videoLinkFormatted = videoLink.replace(/&.*/, '')
  const response = await fetch(SERVER_NAME + `/phrase?url=${videoLinkFormatted}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await response.json()
}

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

async function getUserProfile () {
  return await getData(SERVER_NAME + '/profile')
}

async function sendUserAuth (signInData) {
  postData(SERVER_NAME + '/auth', signInData)
}

export { postData, getData, getVideoData, getUserProfile, sendUserAuth }
