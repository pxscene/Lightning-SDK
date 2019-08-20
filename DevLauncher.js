import {} from "./js/lib/lightning-web.js";
// MODIFICATION: removed this lib reference as it is making http calls to a metrological endpoint
// that is not needed by applications and it also presents potential security concerns
// additionall lib makes api call just by importing is which hamers testability
// import maf from "./js/src/maf.js";
import ux from "./js/src/ux.js";

export default class DevLauncher {

    constructor() {
        var useInterval = ux.Ui.getOption("useInterval");
        if (useInterval) {
            this._setupInterval(useInterval);
        }
    }

    _setupInterval(useInterval) {
        console.log('use interval instead of request animation frame');

        var interval = parseInt(useInterval);

        // Work-around for requestAnimationFrame bug.
        var lastFrameTime = 0;
        window.requestAnimationFrame = function(callback) {
            var currentTime = Date.now();
            var targetTime = Math.max(lastFrameTime + interval, currentTime);

            return window.setTimeout(function() {
                lastFrameTime = Date.now();
                callback();
            }, targetTime - currentTime);
        };
    }

    launch(appType, lightningOptions, options = {}) {
        this._appType = appType;
        this._options = options;
        return this._start(lightningOptions);
    }

    static set uxPath(uxPath) {
        this._uxPath = uxPath;
    }

    _start(lightningOptions = {}) {
        this._addStyles();
        this._lightningOptions = this._getLightningOptions(lightningOptions);
        return this._startApp();
    }

    _startApp() {
        ux.Ui.staticFilesPath = DevLauncher._uxPath;
        return this._loadInspector().then(() => {
            const bootstrap = new ux.Ui(this._lightningOptions);
            bootstrap.startApp(this._appType);
            const canvas = bootstrap.stage.getCanvas();
            document.body.appendChild(canvas);
            window.ui = bootstrap;
            return bootstrap;
        })
    }

    _loadInspector() {
        if (this._options.useInspector) {
            /* Attach the inspector to create a fake DOM that shows where lightning elements can be found. */
            return this.loadScript(DevLauncher._uxPath + "./js/lib/lightning-inspect.js");
        } else {
            return Promise.resolve();
        }
    }

    _addStyles() {
        const style = document.createElement('style');
        // MODIFICATION - removeds hardcoded black background.
        // This should be specified by applications not framework
        style.innerText = `
*,body{
    margin:0;
    padding:0;
}

canvas {
    position: absolute;
    z-index: 2;
}`;
        document.head.appendChild(style);
    }

    loadScript(src) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.onload = function() {
                resolve();
            };
            script.onerror = function(e) {
                reject(new Error("Script load error for " + src + ": " + e));
            };
            script.src = src;
            document.head.appendChild(script);
        });
    }

    _getLightningOptions(customOptions = {}) {
        // MODIFICATION - dont need these default mappings - just need an empty array to make
        // sure the web key event handler is registered properly - this should be changed to allow
        // application to set the handlers if desired rather than hardcoding
        let options = {stage: {w: 1920, h: 1080, clearColor: 0x00000000, canvas2d: false}, debug: false, keys: {}};

        const config = options.stage;
        if (ux.Ui.hasOption("720") || window.innerHeight === 720) {
            config['w'] = 1280;
            config['h'] = 720;
            config['precision'] = 0.6666666667;
        } else {
            config['w'] = 1920;
            config['h'] = 1080;

            config.useImageWorker = true;
        }

        if (!config.memoryPressure) {
            const memoryPressure = ux.Ui.getOption('memoryPressure');
            if (memoryPressure) {
                config.memoryPressure = memoryPressure;
                console.log('GPU memory pressure: ' + memoryPressure);
            }
        }

        options = lng.tools.ObjMerger.merge(options, customOptions);

        return options;
    }

    // MODIFICATION - no longer used.
    // _getNavigationKeys() {
    //   return {
    //     8: "Back",
    //     13: "Enter",
    //     27: "Menu",
    //     37: "Left",
    //     38: "Up",
    //     39: "Right",
    //     40: "Down",
    //     174: "ChannelDown",
    //     175: "ChannelUp",
    //     178: "Stop",
    //     250: "PlayPause",
    //     191: "Search", // Use "/" for keyboard
    //     // 409: "Search"
    //   };
    // }
}

DevLauncher._uxPath = "./node_modules/wpe-lightning-sdk/";
