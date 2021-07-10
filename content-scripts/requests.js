/* global fetch */

'use strict'

const SERVER_NAME = 'http://localhost:5000'

async function __postData (url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return await response.json()
}

/*
async function __getData (url) {
  const response = await fetch(url, {
    method: 'GET'
  })
  return await response.json()
}
*/

const Requests = {}

Requests.submitPhrase = async function (translationData) {
  await __postData(SERVER_NAME + '/phrase', translationData)
}

Requests.getVideoData = async function (videoLink) {
  const videoLinkFormatted = videoLink.replace(/&.*/, '')
  const response = await fetch(SERVER_NAME + `/subtitle?url=${videoLinkFormatted}&lang=en`, {
    method: 'GET'
  })
  return await response.json()
}
