import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';
import * as THREE from 'three';


class MyGuiInterface {
    constructor(app) {
        this.app = app;
        this.datgui = new GUI();
        this.contents = null;
        this.cameraFolder = null;
        this.cameraControlFolder = null;
        this.cameraTargetFolder = null;
    }
    updateCameraFolder() {
        // Remove existing folders specific to the previous camera, if any
        if (this.cameraFolder) {
            this.cameraFolder.destroy();
        }
        if (this.cameraPositionFolder) {
            this.cameraPositionFolder.destroy();
        }
        if (this.cameraTargetFolder) {
            this.cameraTargetFolder.destroy();
        }

        const camerasNames = Object.keys(this.app.cameras);

        this.cameraFolder = this.datgui.addFolder('Cameras');

        this.cameraFolder.add(this.app, 'activeCameraName', camerasNames).name("active camera").onChange((data) => {
            this.app.setActiveCamera(data);
        });

        const camera = this.app.activeCamera;

        // Add common controls
        this.cameraFolder.add(camera, 'near', 0.1, 1000).name("Near").onChange(() => {
            camera.updateProjectionMatrix();
        });
        this.cameraFolder.add(camera, 'far', 0.1, 1000).name("Far").onChange(() => {
            camera.updateProjectionMatrix();
        });
        this.cameraFolder.add(camera, 'zoom', 0.5, 5).name("Zoom").onChange(() => {
            camera.updateProjectionMatrix();
        });

        // Specific controls based on camera type
        if (camera.isPerspectiveCamera) {
            // Perspective camera controls
            this.cameraFolder.add(camera, 'fov', 10, 170).name("FOV").onChange(() => {
                camera.updateProjectionMatrix();
            });
        } else {
            // Orthographic camera controls
            this.cameraFolder.add(camera, 'left', -15, 0).name("Left").onChange(() => {
                camera.updateProjectionMatrix();
            });
            this.cameraFolder.add(camera, 'right', 0, 15).name("Right").onChange(() => {
                camera.updateProjectionMatrix();
            });
            this.cameraFolder.add(camera, 'top', 0, 15).name("Top").onChange(() => {
                camera.updateProjectionMatrix();
            });
            this.cameraFolder.add(camera, 'bottom', -15, 0).name("Bottom").onChange(() => {
                camera.updateProjectionMatrix();
            });
        }


        this.cameraPositionFolder = this.cameraFolder.addFolder('Position');

        // Controls for camera position
        this.cameraPositionFolder.add(camera.position, 'x', -50, 50).name('x').onChange(() => {
            camera.updateProjectionMatrix();
        });
        this.cameraPositionFolder.add(camera.position, 'y', -50, 50).name('y').onChange(() => {
            camera.updateProjectionMatrix();
        });
        this.cameraPositionFolder.add(camera.position, 'z', -50, 50).name('z').onChange(() => {
            camera.updateProjectionMatrix();
        });


        if (camera.isPerspectiveCamera) {

            this.cameraTargetFolder = this.cameraFolder.addFolder('Target');

            // Controls for camera target
            this.cameraTargetFolder.add(camera.target, 'x', -50, 50).name('x').onChange(() => {
                this.app.controls.target.x = camera.target.x;
            });
            this.cameraTargetFolder.add(camera.target, 'y', -50, 50).name('y').onChange(() => {
                this.app.controls.target.y = camera.target.y;
            });
            this.cameraTargetFolder.add(camera.target, 'z', -50, 50).name('z').onChange(() => {
                this.app.controls.target.z = camera.target.z;
            });
        }

        this.cameraFolder.open();
    }

    setContents(contents) {
        this.contents = contents;
    }
}

export { MyGuiInterface };
