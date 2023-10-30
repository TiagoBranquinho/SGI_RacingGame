import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

class MyGuiInterface {
    constructor(app) {
        this.app = app;
        this.datgui = new GUI();
        this.contents = null;
    }

    setContents(contents) {
        this.contents = contents;
    }

    init() {
        this.createGUI();
    }

    createGUI() {
        let cameraFolder = this.datgui.addFolder('Camera');
        cameraFolder.add(this.app, 'activeCameraName', this.app.cameraNames).name('active camera').listen().onChange((value) => {this.app.setActiveCamera(value)});
        cameraFolder.open();
    }
}

export { MyGuiInterface };
