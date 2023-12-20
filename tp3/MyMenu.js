import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { MyEventHandler } from './MyEventHandler.js';


class MyMenu {

    constructor(contents) {
        this.contents = contents;
        this.menu = new THREE.Group();
        this.intersectObjects = [];
        this.rotatableObjects = [];
        this.createMenu();
        this.menuHandler = new MyEventHandler(this.contents, this.intersectObjects, this.rotatableObjects);
    }

    createMenu() {
        this.initCameras();
        this.initLights();
        this.addText('F1eup', new THREE.Vector3(-2, 4, 0), 1.2, 8, true);
        this.addText('Choose your car', new THREE.Vector3(-5, -3, 0), 1, -10, true);
        this.addInteractiveCar('car1.glb', new THREE.Vector3(3, 1, 0), 2);
        this.addInteractiveCar('car2.glb', new THREE.Vector3(-3, 1, 0), 0.01);
        this.addButton(new THREE.Vector3(0, -4, 0), 3, 0.8, 0x0088ff, 'Start', 0.4, 28, true);
    }

    draw(obj) {
        this.menu.add(obj);
    }

    display() {
        this.contents.app.controls.enableRotate = false;
        this.contents.app.controls.enableZoom = false;
        this.contents.app.controls.enablePan = false;
        this.contents.app.scene.add(this.menu);
    }

    async addInteractiveCar(name, position, scale) {
        const src = 't08g01/models/';
        let carGroup = new THREE.Group();
        let car = this.contents.processModel3D({ filepath: src + name });

        // Create a parent group for the car and add all parts to it
        car.position.copy(position);
        car.scale.set(scale, scale, scale);
        car.rotation.x = Math.PI / 8;
        let buttonPosition = position.clone();
        buttonPosition.y -= 1.5;
        let buttonGroup = await this.addButton(buttonPosition, 3, 0.8, 0x0088ff, 'Selected', 0.4, 18);
        // Add the car and button to the carGroup
        carGroup.add(car);
        carGroup.add(buttonGroup);
        this.draw(carGroup);
        console.log(buttonGroup)
        this.intersectObjects.push(buttonGroup.children[0]);
        this.rotatableObjects.push(car);
    }

    async addButton(position, length, height, color, text, size, rotationQuotient, draw = false) {
        let buttonGroup = new THREE.Group();
        // Create a button
        const buttonGeometry = new THREE.BoxGeometry(length, height, 0.2);
        const buttonMaterial = new THREE.MeshBasicMaterial({ color: color });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        // Position the button below the car
        button.position.copy(position);
        if(text === 'Start'){
            button.launchGame = true;
        }
        buttonGroup.add(button);
        let labelPosition = button.position.clone();
        labelPosition.y -= height / 2;
        labelPosition.x -= length / 2;
        labelPosition.x += size / 2;
        labelPosition.y += size / 2;
        // Create a text label for the button
        let label = await this.addText(text, labelPosition, size, rotationQuotient); // Corrected here
        buttonGroup.add(label);
        console.log(buttonGroup)
        if (draw) {
            this.intersectObjects.push(button);
            this.draw(buttonGroup);
        }
        return buttonGroup;
    }




    async addText(text, position, size, rotationQuotient, draw = false) {
        return new Promise((resolve, reject) => {
            const loader = new FontLoader();

            loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                const textGeometry = new TextGeometry(text, {
                    font: font,
                    size: size,  // Adjust the size as needed
                    height: 0.1,
                    curveSegments: 12,
                    bevelEnabled: false
                });

                const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.rotation.x = Math.PI / rotationQuotient;

                textMesh.position.copy(position);
                if (draw) {
                    this.draw(textMesh);
                }
                // Resolve with the created text mesh
                resolve(textMesh);
            });
        });
    }



    initCameras() {
        const initialCameras = [
            {
                id: 'camera1',
                type: 'perspective',
                angle: 75,
                near: 0.1,
                far: 1000,
                location: [0, 0, 8],
                target: [0, 0, 0]
            },
            // Add more cameras as needed
        ];
        this.contents.configureCameras(initialCameras, 'camera1');
    }

    initLights() {
        const lightsData = {
            type: 'globals',
            ambient: {
                isColor: true,
                r: 1, // Example ambient color values
                g: 1,
                b: 1
            },
            background: {
                isColor: true,
                r: 0.1, // Example background color values
                g: 0.1,
                b: 0.1
            }
        };

        this.contents.configureGlobals(lightsData);
    }


}

export { MyMenu };
