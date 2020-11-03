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
