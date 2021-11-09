/* global Requests */
/* global Settings */
/* global Utils */

'use strict'

const YouTubeUI = {}

YouTubeUI.triggerShowtime = 8000

YouTubeUI.triggerActions = {
  EDIT: 'edit',
  VOTE: 'vote'
}

YouTubeUI.showEditor = async function () {
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

YouTubeUI.triggerEditor = async function (sortedPhrases) {
  document.querySelector('.video-stream').pause()
  document.querySelector('.video-stream').currentTime = sortedPhrases[1].start / 1000

  await YouTubeUI.showEditor()

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

YouTubeUI.showInlineEdit = function (content, submitAction) {
  /* WARNING! expects escaped content */
  const subClass = 'subtite__inline-edit'
  let theSub = document.querySelector('.' + subClass)
  if (theSub !== null) {
    theSub.innerHTML = `
      <textarea>${content}</textarea>
    `
    theSub.children[0].select()
    return
  }
  theSub = document.createElement('div')
  theSub.addEventListener('keydown', async (e) => {
    // TODO: make cross-browser
    e.stopPropagation()
  }, true)
  theSub.addEventListener('keypress', async (e) => {
    // TODO: make cross-browser
    e.stopPropagation()
  }, true)
  theSub.addEventListener('keyup', async (e) => {
    // TODO: make cross-browser
    e.stopPropagation()
    if (e.key !== Settings.UInterface.submitEditKey) { return }
    const eMods = Utils.parseEventModifiers(e)
    for (const keyMod of Settings.UInterface.submitEditKeyMods) {
      if (!eMods.has(keyMod)) { return }
    }
    await submitAction(theSub.children[0].value, e)
  }, true)
  theSub.classList.add(subClass)
  theSub.innerHTML = `
    <textarea>${content}</textarea>
  `
  document.getElementById('movie_player').appendChild(theSub)
  theSub.children[0].select()
}

YouTubeUI.removeInlineEdit = function () {
  const subClass = 'subtite__inline-edit'
  const theSub = document.querySelector('.' + subClass)
  if (theSub === null) {
    return
  }
  theSub.remove()
}

YouTubeUI.showTrigger = function (type, callback) {
  const theLogo = document.createElement('div')
  theLogo.addEventListener('click', async () => {
    document.getElementById('movie_player').removeChild(theLogo)
    await callback()
  })
  theLogo.classList.add('subtite__triggerAction')
  theLogo.classList.add('subtite__action_' + type)
  document.getElementById('movie_player').appendChild(theLogo)
  window.setTimeout(() => {
    document.getElementById('movie_player').removeChild(theLogo)
  }, YouTubeUI.triggerShowtime)
}

YouTubeUI.replaceSubtitle = function (phrase, onClick) {
  const subClass = 'subtite__subtitle'
  let theSub = document.querySelector('.' + subClass)
  if (theSub === null) {
    theSub = document.createElement('div')
    theSub.classList.add(subClass)
    theSub.addEventListener('click', onClick, true)
    document.getElementById('movie_player').appendChild(theSub)
  }
  theSub.innerHTML = phrase
}

YouTubeUI.removeSubtitle = function () {
  const subClass = 'subtite__subtitle'
  const theSub = document.querySelector('.' + subClass)
  if (theSub === null) {
    return
  }
  theSub.remove()
}

YouTubeUI.getVideoTimestamp = function () { return document.querySelector('.video-stream').currentTime }

const UInterface = YouTubeUI
