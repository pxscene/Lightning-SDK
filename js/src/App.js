import Ui from "./Ui.js";

export default class App extends lightning.Component {

    static g(c) {
        return c.seekAncestorByType(this);
    }

    /**
     * Returns all fonts to be preloaded before entering this app.
     * @returns {{family: string, url: string, descriptors: {}}[]}
     */
    static getFonts() {
        return [];
    }

    getPath(relPath) {
        return App.getPath(this.constructor, relPath);
    }

    static getPath(relPath) {
        return Ui._staticFilesPath + "static/" + relPath;
    }

    static get identifier() {
        throw new Error("Please supply an identifier in the App definition file.");
    }

}
