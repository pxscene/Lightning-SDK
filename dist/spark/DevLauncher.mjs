import ux from "./src/ux.mjs";
import lng from 'wpe-lightning-spark';
import fetch from "node-fetch";
// MODIFICATION - per direction from spark team - this script dependency is not needed
// import keyboard from "./src/keyboard.mjs";

export default class DevLauncher {

    // MODIFICATION - per spark team keyboard is not needed by spark runtime
    // constructor() {
    //     keyboard((event) => {
    //         this._handleKey(event);
    //     });
    // }

    launch(appType, lightningOptions, options = {}) {
        this._appType = appType;
        this._options = options;
        return this._start(lightningOptions);
    }

    _handleKey(event) {
        this._ui._receiveKeydown(
            // MODIFICATION: normalizes spark key event to the same structure
            // as web keyboard event so that we can have "consistent" key handling code
            // across platforms
            this._normalizeKeyEvent(event));
    }

    // MODIFICATION: normalize key event to the same structure as web event
    // so that we can have consistent key handling across platforms - this is
    // as simple implementation for example purposes
    _normalizeKeyEvent(keyEvent) {
        const f = keyEvent.flags;
        return {
            keyCode: keyEvent.keyCode,
            altKey: f === 48 || f === 56,
            ctrlKey: f === 16 || f === 48 || f === 24 || f === 56,
            shiftKey: f === 8 || f === 136 || f === 24 || f === 56,
        };
    }

    _start(lightningOptions = {}) {
        // MODIFICATION - remove call to metro rest endpoint.
        // this._openFirewall();
        this._lightningOptions = this._getLightningOptions(lightningOptions);
        return this._startApp();
    }

    _startApp() {
        ux.Ui.staticFilesPath = __dirname + "/";

        this._ui = new ux.Ui(this._lightningOptions);
        this._ui.startApp(this._appType);
    }

    // MODIFICATION - remove this code as inspector requires browser to work
    // _loadInspector() {
    //     if (this._options.useInspector) {
    //         /* Attach the inspector to create a fake DOM that shows where lightning elements can be found. */
    //         return this.loadScript(DevLauncher._uxPath + "../wpe-lightning/devtools/lightning-inspect.js");
    //     } else {
    //         return Promise.resolve();
    //     }
    // }

    // MODIFICATION - no longer used
    // _openFirewall() {
    //     Fetch app store to ensure that proxy/image servers firewall is opened.
    //     fetch(`http://widgets.metrological.com/${encodeURIComponent(ux.Ui.getOption('operator') || 'metrological')}/nl/test`).then(() => {});
    // }

    _getLightningOptions(customOptions = {}) {
        // MODIFICATION - this file is spark aware - per spark team
        // the resolution will always be 1280x720 - if not this should be externalized
        // so applications can set accordingly
        let options = {
            stage: {
                w: 1280, h: 720,
                precision: 0.6666666667,
            },
            debug: false,
            // MODIFICATION - dont need these mappings, commenting out the property
            // disables the confusing "no key handler registered" console message
            // keys: this._getNavigationKeys(),
        };
        return lng.tools.ObjMerger.merge(options, customOptions);
    }

    // MODIFICATION - no longer referenced
    // _getNavigationKeys() {
    //     return {
    //         8: "Back",
    //         13: "Enter",
    //         27: "Menu",
    //         37: "Left",
    //         38: "Up",
    //         39: "Right",
    //         40: "Down",
    //         174: "ChannelDown",
    //         175: "ChannelUp",
    //         178: "Stop",
    //         250: "PlayPause",
    //         191: "Search", // Use "/" for keyboard
    //         409: "Search"
    //     };
    // }
}
