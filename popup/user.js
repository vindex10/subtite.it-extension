'use strict'

class UserIdentity {
  constructor () {
    this.__identity = null
  }

  set (identity) {
    if (this.__identity !== null) {
      console.log('Warning: identity is not pure. Missing call to `flush`.')
    }
    this.__identity = identity
  }

  get () {
    return this.__identity
  }

  flush (identity) {
    this.__identity = null
  }
}

const Identity = new UserIdentity()

function currentUser () {
  return Identity.get()
}

export { Identity, currentUser }
