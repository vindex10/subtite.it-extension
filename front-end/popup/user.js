"use strict";

export {Identity, currentUser}

class UserIdentity {
    constructor() {
        this.__identity = null;
    }

    set(identity) {
        if (this.__identity !== null) {
            console.log("Warning: identity is not pure. Missing call to `flush`.");
        }
        this.__identity = identity;
    }

    get() {
        return this.__identity;
    }

    flush(identity) {
        this.__identity = null;
    }
}

let Identity = new UserIdentity();

function currentUser() {
    return Identity.get();
}

