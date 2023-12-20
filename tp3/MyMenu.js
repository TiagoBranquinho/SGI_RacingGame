import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { MyEventHandler } from './MyEventHandler.js';


class MyMenu {

    constructor(contents) {
        this.contents = contents;
        this.menu = new THREE.Group();
        this.intersectObjects = [];
        this.createMenu();
        console.log(this.menu);
        this.menuHandler = new MyEventHandler(this.contents, this.intersectObjects);
    }

    createMenu() {
        this.initCameras();
        this.initLights();
        this.addText('F1eup', new THREE.Vector3(-2, 3, 0), 1.2, 8);
        this.addText('Choose your car', new THREE.Vector3(-5, -4, 0), 1, -10);
        this.addInteractiveSquare('car1.glb', new THREE.Vector3(3, -2, 0), 2);
        this.addInteractiveSquare('car2.glb', new THREE.Vector3(-3, -2, 0), 0.01);
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

    addInteractiveSquare(name, position, scale) {
        const src = 't08g01/models/';

        let car = this.contents.processModel3D({ filepath: src + name })
        car.position.x = position.x;
        car.position.y = position.y;
        car.position.z = position.z;
        car.scale.set(scale, scale, scale);
        //put car looking at the camera
        let target = this.contents.app.activeCamera.position;
        target.y = -1
        car.lookAt(position);
        if (name == 'car1.glb') {
            car.rotation.y = Math.PI / 1.1;
        }

        this.draw(car);

        this.intersectObjects.push(car);
    }

    addText(text, position, size, rotationQuotient) {
        const loader = new FontLoader();

        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const textGeometry = new TextGeometry(text, {
                font: font,
                size: size,  // Adjust the size as needed
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false

            });

            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.rotation.x = Math.PI / rotationQuotient;

            textMesh.position.copy(position);

            this.draw(textMesh);
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
                location: [0, 2, 8],
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
