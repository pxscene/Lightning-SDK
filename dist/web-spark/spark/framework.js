const fetch = require("node-fetch");
const Headers = fetch.Headers;
const lng = require("./lightning-spark");
require('vm').createScript(require('fs').readFileSync(__dirname + '/../js/src/ux.js')).runInThisContext();
require('vm').createScript(require('fs').readFileSync(__dirname + '/../js/src/appBundle.js')).runInThisContext();