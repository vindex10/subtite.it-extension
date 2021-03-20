/* global Requests */

'use strict'

const Storage = {}

Storage._currentSubtitle = undefined

Storage.syncPhrases = async function () {
  const uri = window.location.href
  const phrasesData = await Requests.getVideoData(uri)
  Storage._currentSubtitle = phrasesData
}

Storage.getCurrentPhrases = async function () {
  if (typeof Storage._currentSubtitle === 'undefined') { return undefined }
  return Storage._currentSubtitle.phrases
}

Storage.getCurrentAssessments = async function () {
  if (typeof Storage._currentSubtitle === 'undefined') { return undefined }
  return Storage._currentSubtitle.assessments
}
