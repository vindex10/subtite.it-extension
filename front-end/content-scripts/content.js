/* global Requests, browser */

'use strict'

// import {submitPhrase} as Requests from './requests.js'

async function showEditor (sortedPhrases) {
  const moviePlayer = document.getElementById('movie_player')

  const oldEditPopup = document.querySelector('.subtite__edit-subtitle')
  if (oldEditPopup) {
    moviePlayer.removeChild(oldEditPopup)
  }

  const editPopup = document.createElement('div')
  editPopup.classList.add('subtite__edit-subtitle')
  editPopup.innerHTML = `
    <div class="sidebar">&nbsp;</div>
    <form action="#" class="edit-subtitle_form">
      <div class="top-controls">
        <input type="button" class="cancel" title="Cancel" value="" />
      </div>
      <div class="content">
        <div class="phrase-container">
          <div class="phrase-contols"><span class="replay">&nbsp;</span></div>
          <p class="phrase">${sortedPhrases[0].data}</p>
        </div>
        <div class="phrase-container">
          <div class="phrase-contols"><span class="replay">&nbsp;</span></div>
          <p class="phrase editable">${sortedPhrases[1].data}</p>
        </div>
        <div class="phrase-container">
          <div class="phrase-contols"><span class="replay">&nbsp;</span></div>
          <textarea class="phrase edited">${sortedPhrases[1].data}</textarea>
          <input type="hidden" name="edition-token" class="edition-token" value="${sortedPhrases[1].edition_id}" />
        </div>
        <div class="phrase-container">
          <div class="phrase-contols"><span class="replay">&nbsp;</span></div>
          <p class="phrase">${sortedPhrases[2].data}</p>
        </div>
      </div>
      <div class="bottom-controls">
        <input type="submit" class="submit" title="Submit" value="" />
      </div>
    </form>
  `
  moviePlayer.appendChild(editPopup)

  document.querySelector('.subtite__edit-subtitle .cancel').addEventListener('click', async (event) => {
    moviePlayer.removeChild(editPopup)
    document.querySelector('.video-stream').play()
  })

  document.querySelector('.subtite__edit-subtitle .submit').addEventListener('click', async (event) => {
    event.preventDefault()

    const data = editPopup.querySelector('.phrase.edited').value
    const editionId = editPopup.querySelector('.edition-token').value

    const translationData = {
      editionId,
      data
    }

    try {
      await Requests.submitPhrase(translationData)

      document.querySelector('.add-translation__toggle-button').innerText = 'Show'
      document.querySelector('.add-translation__form').classList.add('hide-add-translation')
    } catch (error) {
      console.log('Translation cannot be saved: ', error)
    }
    moviePlayer.removeChild(editPopup)
    document.querySelector('.video-stream').play()
  })
}

async function triggerEditor (sortedPhrases) {
  document.querySelector('.video-stream').pause()
  document.querySelector('.video-stream').currentTime = sortedPhrases[1].start / 1000
  await showEditor(sortedPhrases)
}

browser.runtime.onMessage.addListener(async (request) => {
  if (request.action === 'triggerEdit') {
    await triggerEditor(request.sortedPhrases)
  }
})
