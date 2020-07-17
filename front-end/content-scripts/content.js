/* global Requests, browser */

'use strict'

// import {submitPhrase} as Requests from './requests.js'

function showEditor () {
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

function triggerEditor (sortedPhrases) {
  document.querySelector('.video-stream').pause()
  document.querySelector('.video-stream').currentTime = sortedPhrases[1].start / 1000

  showEditor()

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

const YT = {}

YT.triggerShowtime = 8000

YT.triggerActions = {
  EDIT: 'edit',
  VOTE: 'vote'
}

YT.showTrigger = async function (type, callback) {
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
  }, YT.triggerShowtime)
}

window.addEventListener('keydown', async (e) => {
  // trigger on Space
  let type
  if (e.keyCode === 69) {
    type = YT.triggerActions.EDIT
  } else if (e.keyCode === 86) {
    type = YT.triggerActions.VOTE
  } else {
    return
  }

  let sortedPhrases

  try {
    sortedPhrases = await getAndPreparePhrases(window.location.href)
  } catch (e) {
    console.log("Couldn't fetch phrases. No trigger")
    console.log(e)
    sortedPhrases = null
  }

  if (sortedPhrases === null) {
    return
  }

  await YT.showTrigger(type, async () => {
    triggerEditor(sortedPhrases)
  })
})

browser.runtime.onMessage.addListener((request) => {
  if (request.action === 'triggerEdit') {
    triggerEditor(request.sortedPhrases)
  }
})
