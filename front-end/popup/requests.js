"use strict";

export {postData, getData, getVideoData, getUserProfile, sendUserAuth}

let SERVER_NAME = "https://subtite.it:3000"

async function getVideoData(videoLink) {
  const videoLinkFormatted = videoLink.replace(/&.*/, '');
  const response = await fetch(SERVER_NAME + `/phrase?url=${videoLinkFormatted}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return await response.json();
}

async function postData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}

async function getData(url) {
  const response = await fetch(url, {
    method: 'GET'
  });
  return await response.json();
}

async function getUserProfile() {
    return await getData(SERVER_NAME + '/profile');
}

async function submitPhrase(translationData) {
    await postData(SERVER_NAME + '/phrase', translationData);
}

async function sendUserAuth(signInData) {
    postData(SERVER_NAME + '/auth', signInData)
}
