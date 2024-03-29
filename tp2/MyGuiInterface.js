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
        this.currentLightName = { light: null };
        this.nodeList = [];
        this.currentNodeName = { node: null };

    }
    updateCameraFolder() {
        const camerasNames = Object.keys(this.app.cameras);

        this.cameraFolder = this.datgui.addFolder('Cameras');

        this.cameraFolder.add(this.app, 'activeCameraName', camerasNames).name("active camera").onChange((data) => {
            this.app.setActiveCamera(data);
        });

        const camera = this.app.activeCamera;

        // Add common controls
        this.cameraFolder.add(camera, 'near', 0.1, 30).name("Near").onChange(() => {
            camera.updateProjectionMatrix();
        });
        this.cameraFolder.add(camera, 'far', 0, 100).name("Far").onChange(() => {
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

    updateGlobalsFolder() {
        // Controls for the globals color

        this.globalsFolder = this.datgui.addFolder('Globals');
        this.backgroundFolder = this.globalsFolder.addFolder('Background');
        this.ambientFolder = this.globalsFolder.addFolder('Ambient');


        this.backgroundFolder.addColor(this.app.scene, 'background').name("Color");

        this.ambientFolder.addColor(this.app.scene.children[0], 'color').name("Color");

        this.globalsFolder.open();
    }

    updateFogFolder() {
        // Controls for the fog

        this.fogFolder = this.datgui.addFolder('Fog');

        this.fogFolder.addColor(this.app.scene.fog, 'color').name("Color");
        this.fogFolder.add(this.app.scene.fog, 'near', -50, 50).name('Near');
        this.fogFolder.add(this.app.scene.fog, 'far', 0, 200).name('Far');
        this.fogFolder.open();
    }

    updateLightFolder() {
        let lightFolder = this.datgui.addFolder('Lights');
        console.log(this.app);
        // Controls for the light
        // Iterate through all the lights and create folders for each type of light

        const lightsList = Object.values(this.app.lights);
        const lightsNames = lightsList.map(light => light.children[0].name);

        //make checkbox to make light helpers invisible
        lightFolder.add(this.app, 'lightHelpersVisible').name('light helpers visible').onChange(() => {
            for (let i = 0; i < lightsList.length; i++) {
                lightsList[i].children[1].visible = this.app.lightHelpersVisible;
            }
        });
        // Add a dropdown to select the light
        lightFolder.add(this.currentLightName, 'light', lightsNames)
            .name('Select Light')
            .onChange(() => {
                this.reset()
            });
        const selectedLightGroup = lightsList.find(light => light.children[0].name === this.currentLightName.light);




        // Add controls based on the type of the selected light
        if (selectedLightGroup) {
            let specificFolder = lightFolder.addFolder(this.currentLightName.light);
            let selectedLight = selectedLightGroup.children[0];
            specificFolder.add(selectedLightGroup, 'visible').name('on');
            let positionFolder = specificFolder.addFolder('Position');
            positionFolder.add(selectedLightGroup.position, 'x', -50, 50).name('x');
            positionFolder.add(selectedLightGroup.position, 'y', -50, 50).name('y');
            positionFolder.add(selectedLightGroup.position, 'z', -50, 50).name('z');
            specificFolder.addColor(selectedLight, 'color').name("color");
            specificFolder.add(selectedLight, 'intensity', 0, 100).name("intensity");
            specificFolder.add(selectedLight, 'castShadow').name('cast shadow');
            specificFolder.add(selectedLight.shadow.camera, 'far', 200, 600).name('shadow far');
            specificFolder.add(selectedLight.shadow.mapSize, 'height', 256, 1024).name('shadow map size').onChange(() => {
                selectedLight.shadow.mapSize.width = selectedLight.shadow.mapSize.height;
            });
            switch (true) {

                case selectedLight.isSpotLight:
                    let targetFolder = specificFolder.addFolder('Target');
                    targetFolder.add(selectedLight.target.position, 'x', -50, 50).name('target x');
                    targetFolder.add(selectedLight.target.position, 'y', -50, 50).name('target y');
                    targetFolder.add(selectedLight.target.position, 'z', -50, 50).name('target z');
                    specificFolder.add(selectedLight, 'angle', 0, 10).name("angle");
                    specificFolder.add(selectedLight, 'distance', 500, 1500).name("distance");
                    specificFolder.add(selectedLight, 'decay', 1, 3).name("decay");
                    specificFolder.add(selectedLight, 'penumbra', 0, 2).name("penumbra");
                    break;

                case selectedLight.isPointLight:
                    specificFolder.add(selectedLight, 'distance', 500, 1500).name("distance");
                    specificFolder.add(selectedLight, 'decay', 1, 3).name("decay");
                    break;

                case selectedLight.isDirectionalLight:
                    specificFolder.add(selectedLight.shadow, 'left', -10, 0).name("shadow left");
                    specificFolder.add(selectedLight.shadow, 'right', 0, 10).name("shadow right");
                    specificFolder.add(selectedLight.shadow, 'bottom', -10, 0).name("shadow bottom");
                    specificFolder.add(selectedLight.shadow, 'top', 0, 10).name("shadow top");
                    break;
            }
        }

        lightFolder.open();
    }

    updateNodesFolder() {
        for (let i = 0; i < this.app.scene.children.length; i++) {
            this.dfs(this.app.scene.children[i]);
        }
        console.log(this.nodeList)
        let nodesFolder = this.datgui.addFolder('Nodes');
        const nodesNames = this.nodeList.map(node => node.name.slice(1));
        nodesFolder.add(this.currentNodeName, 'node', nodesNames)
            .name('Select Node')
            .onChange(() => {
                this.reset()
            });
        const selectedNode = this.nodeList.find(node => node.name.slice(1) === this.currentNodeName.node);
        if (selectedNode) {
            let specificFolder = nodesFolder.addFolder(this.currentNodeName.node);
            specificFolder.add(selectedNode, 'visible').name('visible');
            let positionFolder = specificFolder.addFolder('Position');
            positionFolder.add(selectedNode.position, 'x', -10, 10).name('x');
            positionFolder.add(selectedNode.position, 'y', -10, 10).name('y');
            positionFolder.add(selectedNode.position, 'z', -10, 10).name('z');
            let rotationFolder = specificFolder.addFolder('Rotation');
            rotationFolder.add(selectedNode.rotation, 'x', -3.14, 3.14).name('x');
            rotationFolder.add(selectedNode.rotation, 'y', -3.14, 3.14).name('y');
            rotationFolder.add(selectedNode.rotation, 'z', -3.14, 3.14).name('z');
            let scaleFolder = specificFolder.addFolder('Scale');
            scaleFolder.add(selectedNode.scale, 'x', 0.5, 5).name('x');
            scaleFolder.add(selectedNode.scale, 'y', 0.5, 5).name('y');
            scaleFolder.add(selectedNode.scale, 'z', 0.5, 5).name('z');
        }
    }

    dfs(node) {
        // Perform some operation on the current node
        // For example, storing it in the nodeList
        if (node.name !== "") {
            if (this.countOccurrences(node.name, '&') > 1 && this.countOccurrences(node.name, '&') < 4) {
                this.nodeList.push(node);
            }
        }

        // Recursively traverse the children of the current node
        if (node.children && node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                this.dfs(node.children[i]);
            }
        }
    }
    countOccurrences(str, char) {
        let count = 0;

        for (let i = 0; i < str.length; i++) {
            if (str.charAt(i) === char) {
                count++;
            }
        }
        return count;
    }

    reset() {
        this.datgui.destroy();
        this.datgui = new GUI();
        this.updateCameraFolder();
        this.updateGlobalsFolder();
        this.updateFogFolder();
        this.updateLightFolder();
        this.updateNodesFolder();
    }

    setContents(contents) {
        this.contents = contents;
    }
}

export { MyGuiInterface };
