// MODIFICATION - not all applications need the media player.
// application should include this for themselves instead of hardcoded
// dependency in the framwework.
// import Mediaplayer from "./Mediaplayer.js";
// import NoopMediaplayer from "./NoopMediaplayer.js";
import ScaledImageTexture from "./ScaledImageTexture.js";

export default class Ui extends lng.Application {

    constructor(options) {
        // MODIFICATION - removed reference to hardcoded Roboto font face
        // application should be required to define it or it should fall back
        // on system default
        //
        // RobotoRegular was being served from metrological endpoints which may
        // present some security concerns for consuming applications
        options.defaultFontFace = options.defaultFontFace;
        super(options);
        this._options = options;
    }

    static _template() {
        return {
            // MODIFICATION - removed reference to media player.
            // Mediaplayer: {type: lng.Utils.isWeb ? Mediaplayer : NoopMediaplayer, textureMode: Ui.hasOption('texture')},
            AppWrapper: {}
        };
    }

    static set staticFilesPath(path) {
        this._staticFilesPath = path;
    }

    get useImageServer() {
        return !Ui.hasOption("noImageServer");
    }

    // MODIFICATION - removed reference to media player.
    // get mediaplayer() {
    //     return this.tag("Mediaplayer");
    // }

    _active() {
        // MODIFICATION - removed reference to media player.
        // this.tag('Mediaplayer').skipRenderToTexture = this._options.skipRenderToTexture;
    }

    startApp(appClass) {
        this._setState("App.Loading", [appClass]);
    }

    stopApp() {
    }

    // MODIFICATION - window close doesnt work in all environemtns and
    // can throw an unhandled error
    //
    // Also using _handleBack subtly requires clients of this class to register a back handler
    // correctly which is not documented
    //
    // Additionally in our case the keycode that signifies
    // application exit is context specific and may not map to keyCode 8 as hardcoded by framework
    // _handleBack() {
    //     if (lng.Utils.isWeb) {
    //         window.close();
    //     }
    // }

    static loadFonts(fonts) {
        if (lng.Utils.isNode) {
            // Font loading not supported. Fonts should be installed in Linux system and then they can be picked up by cairo.
            return Promise.resolve();
        }

        const fontFaces = fonts.map(({family, url, descriptors}) => new FontFace(family, `url(${url})`, descriptors));
        fontFaces.forEach(fontFace => {
            document.fonts.add(fontFace);
        });
        return Promise.all(fontFaces.map(ff => ff.load())).then(() => {return fontFaces});
    }

    static getPath(relPath) {
        return this._staticFilesPath + "static-ux/" + relPath;
    }

    static getFonts() {
        // MODIFICATION - prevent loading of unneeded fonts
        // need a way to let application's specify the fonts to use if specified at this level

        return [
        //     {family: 'RobotoRegular', url: Ui.getPath('fonts/roboto-regular.ttf'), descriptors: {}},
        //     {family: 'Material-Icons', url: Ui.getPath('fonts/Material-Icons.ttf'), descriptors: {}}
        ];
    }

    static _states() {
        return [
            class App extends this {
                stopApp() {
                    this._setState("");
                }
                static _states() {
                    return [
                        class Loading extends this {
                            $enter(context, appClass) {
                                this._startApp(appClass);
                            }
                            _startApp(appClass) {
                                this._currentApp = {
                                    type: appClass,
                                    fontFaces: []
                                };

                                // Preload fonts.
                                const fonts = this._currentApp.type.getFonts();
                                Ui.loadFonts(fonts.concat(Ui.getFonts())).then((fontFaces) => {
                                    this._currentApp.fontFaces = fontFaces;
                                }).catch((e) => {
                                    console.warn('Font loading issues: ' + e);
                                });
                                this._done();
                            }
                            _done() {
                                this._setState("App.Started");
                            }
                        },
                        class Started extends this {
                            $enter() {
                                this.tag("AppWrapper").children = [{ref: "App", type: this._currentApp.type}];
                            }
                            $exit() {
                                this.tag("AppWrapper").children = [];
                            }
                        }
                    ]
                }
            }
        ]
    }

    _getFocused() {
        return this.tag("App");
    }

    _setFocusSettings(settings) {
        settings.clearColor = this.stage.getOption('clearColor');
        // MODIFICATION - removed reference to media player
        // settings.mediaplayer = {
        //     consumer: null,
        //     stream: null,
        //     hide: false,
        //     videoPos: [0, 0, 1920, 1080]
        // };
    }

    _handleFocusSettings(settings) {
        if (this._clearColor !== settings.clearColor) {
            this._clearColor = settings.clearColor;
            this.stage.setClearColor(settings.clearColor);
        }

        // MODIFICATION - removed reference to media player
        // if (this.tag("Mediaplayer").attached) {
        //     this.tag("Mediaplayer").updateSettings(settings.mediaplayer);
        // }
    }

    static getProxyUrl(url, opts = {}) {
        throw new Error("DONT USE");
        // MODIFICATION - removing call out to a metrological cdn - security concerns
        //return this._getCdnProtocol() + "://cdn.metrological.com/proxy" + this.getQueryString(url, opts);
    }

    static getImage(url, opts = {}) {
        return {type: ScaledImageTexture, src: url, scalingOptions: opts};
    }

    static getImageUrl(url, opts = {}) {
        throw new Error("{src: Ui.getImageUrl(...)} is deprecated. Please use {texture: Ui.getImage(...)} instead.");
    }

    static getQrUrl(url, opts = {}) {
        throw new Error("DONT USE");
        // MODIFICATION - removing call out to a metrological cdn - security concerns
        //return this._getCdnProtocol() + "://cdn.metrological.com/qr" + this.getQueryString(url, opts, "q");
    }

    // MODIFICATION - unused code, no longer needed
    // static _getCdnProtocol() {
    //     return lng.Utils.isWeb && location.protocol === "https:" ? "https" : "http";
    // }

    static hasOption(name) {
        if (lng.Utils.isNode) {
            return false;
        }

        return new URL(document.location.href).searchParams.has(name);
    }

    static getOption(name) {
        if (lng.Utils.isNode) {
            return undefined;
        }

        return new URL(document.location.href).searchParams.get(name);
    }

    // MODIFICATION - unused code, no longer needed
    // static getQueryString(url, opts, key = "url") {
    //     let str = `?operator=${encodeURIComponent(this.getOption('operator') || 'metrological')}`;
    //     const keys = Object.keys(opts);
    //     keys.forEach(key => {
    //         str += "&" + encodeURIComponent(key) + "=" + encodeURIComponent("" + opts[key]);
    //     });
    //     str += `&${key}=${encodeURIComponent(url)}`;
    //     return str;
    // }


}

Ui._staticFilesPath = "./";
