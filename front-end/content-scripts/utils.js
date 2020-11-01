'use strict'

const Utils = {}

Utils.listenEvent = class {
  constructor (elem, type, func, capture) {
    this._args = [type, func, capture]
    this._elem = elem
    this._active = true
    elem.addEventListener(type, (e) => {
      func(e, this)
    }, capture)
  }

  destroy () {
    if (this._active) {
      this.elem.removeEventListener(...this._args)
      this._active = false
    }
  }
}

Utils.listenEventOnce = function (elem, type, func, capture) {
  Utils.listenEvent(elem, type, (e, listener) => {
    func(e)
    listener.destroy()
  }, capture)
}
