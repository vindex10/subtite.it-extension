# Subtite.it

Use StandardJS linter for linting: https://standardjs.com/

## Conventions

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
