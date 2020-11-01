/* global Requests */

'use strict'

const Storage = {}

Storage._currentSubtitle = undefined

Storage.getAndPreparePhrases = async function (uri) {
  const phrases = await Requests.getVideoData(uri)
  const phrasesExtended = [...phrases]
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
