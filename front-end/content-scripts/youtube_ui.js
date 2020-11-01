/* global Requests */

'use strict'

const YouTubeUI = {}

YouTubeUI.triggerShowtime = 8000

YouTubeUI.triggerActions = {
  EDIT: 'edit',
  VOTE: 'vote'
}

YouTubeUI.showEditor = function () {
  const oldEditor = document.querySelector('#info .add-translation')
  if (oldEditor) {
    oldEditor.remove()
  }
  document.querySelector('#info-contents').insertAdjacentHTML('beforebegin', `<div class="add-translation">
          <button class="add-translation__toggle-button">Hide</button>
          <form class="add-translation__form">
            <p class="add-translation__text add-translation__prev-text"></p>
            <textarea class="add-translation__text add-translation__textarea" id="phrase-translation"> </textarea>
            <p class="add-translation__text add-translation__next-text"></p>
            <div class="add-translation__submit-button-container">
              <button class="add-translation__download-button">Download Script</button>
              <button class="add-translation__submit-button" type="submit">Submit</button>
            </div>
        </form>
      </div>`)

  document.querySelector('.add-translation__toggle-button').addEventListener('click', (event) => {
    if (!document.querySelector('.add-translation__form').classList.contains('hide-add-translation')) {
      event.target.innerText = 'Show'
      document.querySelector('.add-translation__form').classList.add('hide-add-translation')
    } else {
      event.target.innerText = 'Hide'
      document.querySelector('.add-translation__form').classList.remove('hide-add-translation')
    }
  })
}

YouTubeUI.triggerEditor = function (sortedPhrases) {
  document.querySelector('.video-stream').pause()
  document.querySelector('.video-stream').currentTime = sortedPhrases[1].start / 1000

  YouTubeUI.showEditor()

  document.querySelector('.add-translation__prev-text').innerText = sortedPhrases[0].data
  document.querySelector('.add-translation__textarea').innerText = sortedPhrases[1].data
  document.querySelector('.add-translation__textarea').setAttribute('edition_id', `${sortedPhrases[1].edition_id}`)
  document.querySelector('.add-translation__next-text').innerText = sortedPhrases[2].data

  document.querySelector('.add-translation__form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const data = document.querySelector('#phrase-translation').value
    const editionId = document.querySelector('#phrase-translation').getAttribute('edition_id')

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
  })
}

YouTubeUI.showTrigger = async function (type, callback) {
  const theLogo = document.createElement('div')
  theLogo.addEventListener('click', async () => {
    document.getElementById('movie_player').removeChild(theLogo)
    await callback()
  })
  theLogo.classList.add('subtite__triggerAction')
  theLogo.classList.add('subtite__action_' + type)
  document.getElementById('movie_player').appendChild(theLogo)
  window.setTimeout(async () => {
    document.getElementById('movie_player').removeChild(theLogo)
  }, YouTubeUI.triggerShowtime)
}
