/* global Settings */

'use strict'

class __EventListener {
  constructor (elem, type, func, capture) {
    const THIS = this

    this._elem = elem
    this._active = true

    function callback (e) {
      return func(e, THIS)
    }

    this._args = [type, callback, capture]
    elem.addEventListener(...this._args)
  }

  destroy () {
    if (this._active) {
      this._elem.removeEventListener(...this._args)
      this._active = false
    }
  }
}

const Utils = {}

Utils.listenEvent = (elem, type, func, capture) => { return new __EventListener(elem, type, func, capture) }

Utils.listenEventOnce = function (elem, type, func, capture) {
  function callback (e, listener) {
    func(e)
    listener.destroy()
  }

  Utils.listenEvent(elem, type, callback, capture)
}

Utils.generateGUID = function () {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

Utils.parseEventModifiers = function (e) {
  const res = []
  if (e.ctrlKey) { res.push(Settings.KEY_MOD.ctrl) }
  if (e.shiftKey) { res.push(Settings.KEY_MOD.shift) }
  if (e.altKey) { res.push(Settings.KEY_MOD.alt) }
  if (e.metaKey) { res.push(Settings.KEY_MOD.meta) }
  return new Set(res)
}

const F = {}

F.partial = function (fn, ...firstArgs) { return (...restArgs) => { return fn(...firstArgs, ...restArgs) } }

const CollectionUtils = {}

CollectionUtils.intersectSets = (set1, set2) => {
  const common = []
  for (const e1 of set1) {
    if (!set2.has(e1)) {
      continue
    }
    common.push(e1)
  }
  return new Set(common)
}
