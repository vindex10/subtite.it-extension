/* global Requests, Settings */

'use strict'

const Storage = {}

Storage._currentSubtitle = undefined

Storage.syncPhrases = async function () {
  const uri = window.location.href
  const lang = (await Settings.getSettings(['native_lang'])).native_lang
  const phrasesData = await Requests.getVideoData(uri, lang)
  Storage._currentSubtitle = phrasesData
}

Storage.getCurrentPhrases = function () {
  if (typeof Storage._currentSubtitle === 'undefined') { return undefined }
  return Storage._currentSubtitle.phrases
}

Storage.getCurrentAssessments = function () {
  if (typeof Storage._currentSubtitle === 'undefined') { return undefined }
  return Storage._currentSubtitle.assessments
}
