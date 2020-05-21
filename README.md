Subtite.it Web Extension
========================

Install in the Development mode (Firefox)
-----------------------------------------

* Go to [about:debugging](about:debugging)
* Click "This Firefox" in the left sidebar
* Press "Load Temporary Add-on..."
* Choose `manifest.json` from the `/front-end` dir.
* Enjoy extension in your browser :)


Packaging
---------

Before we start, install `web-ext`: `npm install -g web-ext`

Secrets are stored at Mozilla Developer Hub: [https://addons.mozilla.org/en-US/developers/addon/api/key/](https://addons.mozilla.org/en-US/developers/addon/api/key/)


Steps:

1. Build: `web-ext build front-end/`.
   Output: `web-ext-artifacts/subtite.it-a.b.zip`
2. Sign (to get installable xpi): `web-ext sign --api-key "user:something" --api-secret "jwt-secret"`.
   Output: `web-ext-artifacts.subtiteit-a.b-an+fx.xpi`
