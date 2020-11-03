/* global YouTubeUI, Utils, Storage, browser */

'use strict'

Utils.listenEventOnce(window, 'keydown', (e) => {
  alert('Hello!')
  // Storage.getAndPreparePhrases(window.location.href)
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
