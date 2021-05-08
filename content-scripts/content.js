/* global TimelineEvents, TimelineEvent, UInterface, Utils, F, Storage */

'use strict'

function tEventFromPhrase (phrase) {
  const tstart = phrase.start / 1000
  const tstop = phrase.stop / 1000
  const eactivate = F.partial(UInterface.replaceSubtitle, phrase.data)
  const edeactivate = TimelineEvents.NOOP
  return new TimelineEvent(tstart, tstop, eactivate, edeactivate)
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

// browser.runtime.onMessage.addListener((request) => {
// if (request.action === 'triggerEdit') {
// YouTubeUI.triggerEditor(request.sortedPhrases)
// }
// })
