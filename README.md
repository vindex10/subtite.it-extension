Subtite.it Web Extension
========================

## Code conventions

Use StandardJS linter for linting: https://standardjs.com/

### Content Scripts

Usual header of the content script:

```
/* global Requests, browser */

'use strict'

// import {submitPhrase} as Requests from './requests.js'
```

* Always use `use strict` in the beginning of the file.
* Content scripts share global scope, so `Requests` declared in one file will be visible in the other.
Standard linter doesn't know about such a global scope pollution. So let him know.
* Standard linter doesn't know about browser api. API methods like `fetch` should also be added to the list of globals.
* Content scripts don't allow imports. Please annotate imports as if they were allowed.
* Since we share global scope, prefix private methods with "\__", and wrap exported methods into an object:

```
async function __postData (url, data) {
  ...
}

const Requests = {
  submitPhrase: async function (translationData) {
    await __postData(SERVER_NAME + '/phrase', translationData)
  }
}
```

### Pop-up scripts

* Popup scripts allow module imports. Hovewer, import syntax doesn't allow to mention imported modules explicitly.
Please mention them in the comments afterwards:

```
'use strict'

import * as Router from './router.js' // { initRouter }
import * as Actions from './actions.js' // { initSignIn }
```

## Setting up

### Install in the Development mode (Firefox)

* Go to [about:debugging](about:debugging)
* Click "This Firefox" in the left sidebar
* Press "Load Temporary Add-on..."
* Choose `manifest.json` from the `/front-end` dir.
* Enjoy extension in your browser :)


### Packaging

Before we start, install `web-ext`: `npm install -g web-ext`

Secrets are stored at Mozilla Developer Hub: [https://addons.mozilla.org/en-US/developers/addon/api/key/](https://addons.mozilla.org/en-US/developers/addon/api/key/)


Steps:

1. Build: `web-ext build front-end/`.
   Output: `web-ext-artifacts/subtite.it-a.b.zip`
2. Sign (to get installable xpi): `web-ext sign --api-key "user:something" --api-secret "jwt-secret"`.
   Output: `web-ext-artifacts.subtiteit-a.b-an+fx.xpi`
