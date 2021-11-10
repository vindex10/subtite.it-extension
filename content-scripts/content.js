/* global TimelineEvents, TimelineEvent, UInterface, Utils, F, Storage, browser */

'use strict'

async function sendCorrection (oldTEvent, newPhrase) {
  console.log('Send: ' + newPhrase)
  const newSubtitleEvent = TimelineEvent.fromEvent(oldTEvent, {
    activate: F.partial(UInterface.replaceSubtitle, newPhrase, subtitleClick)
  })
  // BUG: what if disabled subtitles in settings in the middle?
  TimelineEvents.replaceEvent(oldTEvent, newSubtitleEvent)
}

function subtitleClick (e) {
  const subtitleDiv = e.currentTarget
  const wasPaused = UInterface.pauseVideo()
  const origPhrase = subtitleDiv.innerText
  const oldTEvent = TimelineEvents.getActiveEventsByTags([TimelineEvents.TAGS.subtitle])[0]
  subtitleDiv.contentEditable = true
  subtitleDiv.focus()
  const listeners = []
  listeners.push(
    Utils.listenEvent(subtitleDiv, 'keydown', async (e, _) => {
      e.stopPropagation()
    }, true)
  )
  listeners.push(
    Utils.listenEvent(subtitleDiv, 'keypress', async (e, _) => {
      e.stopPropagation()
    }, true)
  )
  listeners.push(
    Utils.listenEvent(subtitleDiv, 'focusout', async (e, listener) => {
      e.stopPropagation()
      subtitleDiv.contentEditable = false
      subtitleDiv.innerHTML = origPhrase
      if (!wasPaused) { UInterface.playVideo() }
      listeners.map(l => { l.destroy() })
    }, true)
  )
  listeners.push(
    Utils.listenEvent(subtitleDiv, 'keyup', async (e, listener) => {
      e.stopPropagation()
      if (!UInterface.isSubmitEditEvent(e)) {
        return
      }
      const newPhrase = subtitleDiv.innerText
      await sendCorrection(oldTEvent, newPhrase)
      subtitleDiv.contentEditable = false
      if (!wasPaused) { UInterface.playVideo() }
      listeners.map(l => { l.destroy() })
    }, true)
  )
}

function tEventFromPhrase (phrase) {
  const tstart = phrase.start / 1000
  const tstop = phrase.stop / 1000
  const eactivate = F.partial(UInterface.replaceSubtitle, phrase.data, subtitleClick)
  const edeactivate = UInterface.removeSubtitle
  const tags = new Set([TimelineEvents.TAGS.subtitle])
  return new TimelineEvent(tstart, tstop, eactivate, edeactivate, tags)
}

function _loadPhrases (phrases) {
  for (const p of phrases) {
    const parsedPhrase = tEventFromPhrase(p)
    TimelineEvents.pushEvent(parsedPhrase)
  }
}

Utils.listenEventOnce(window, 'load', async (e) => {
  await Storage.syncPhrases()
  const phrases = Storage.getCurrentPhrases()
  TimelineEvents.initTimelineListener()
  _loadPhrases(phrases)
  TimelineEvents.runTimelineListener()
})

// window.addEventListener('keydown', async (e) => {
/// / trigger on Space
// let type
// if (e.keyCode === 69) {
// type = YouTubeUI.triggerActions.EDIT
// } else if (e.keyCode === 86) {
// type = YouTubeUI.triggerActions.VOTE
// } else {
// return
// }

// let sortedPhrases

// try {
// sortedPhrases = await Storage.getAndPreparePhrases(window.location.href)
// } catch (e) {
// console.log("Couldn't fetch phrases. No trigger")
// console.log(e)
// sortedPhrases = null
// }

// if (sortedPhrases === null) {
// return
// }

// await YouTubeUI.showTrigger(type, async () => {
// YouTubeUI.triggerEditor(sortedPhrases)
// })
// })

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === '#triggerEdit') {
    // YouTubeUI.triggerEditor(request.sortedPhrases)
  } else if (request.action === 'enableSubtitles') {
    try {
      TimelineEvents.enableEventsByTags([TimelineEvents.TAGS.subtitle])
      sendResponse({ status: 200 })
    } catch (e) {
      sendResponse({ status: 500 })
    }
  } else if (request.action === 'disableSubtitles') {
    try {
      TimelineEvents.disableEventsByTags([TimelineEvents.TAGS.subtitle])
      sendResponse({ status: 200 })
    } catch (e) {
      sendResponse({ status: 500 })
    }
  }
})
