import DevLauncher from './DevLauncher.mjs';
import App from "./src/app.mjs";

const launcher = new DevLauncher();

sparkview.on('onKeyDown', function(e) {
    console.log('webgl onKeyDown keyCode:', e.keyCode);
    launcher._handleKey(e);
});

sparkscene.on('onClose', function(e) {
    launcher._stopApp();
});

launcher.launch(App, {debug:false, h:sparkscene.h}, {useInspector: false});