const fetch = require("node-fetch");
const Headers = fetch.Headers;
const lng = require("./lightning-spark");
require('vm').createScript(require('fs').readFileSync(__dirname + '/../src/ux.js')).runInThisContext();
require('vm').createScript(require('fs').readFileSync(__dirname + '/../src/appBundle.js')).runInThisContext();