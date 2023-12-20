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
        this.addText('F1eup', new THREE.Vector3(-2, 3, 0), 1.2, 8);
        this.addText('Choose your car', new THREE.Vector3(-5, -4, 0), 1, -10);
        this.addInteractiveSquare('Car 1', 'car1.jpg', new THREE.Vector3(-3, 0, 0));
        this.addInteractiveSquare('Car 2', 'car2.jpg', new THREE.Vector3(3, 0, 0));
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

    addInteractiveSquare(label, name, position) {
        const src = 't08g01/textures/menu/';
        const squareGeometry = new THREE.PlaneGeometry(4, 4);
        const textureLoader = new THREE.TextureLoader();

        textureLoader.load(src + name, (texture) => {
            const squareMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
            const squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);

            squareMesh.position.copy(position);
            squareMesh.name = label;
            this.draw(squareMesh);
            this.intersectObjects.push(squareMesh);

        });
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
                location: [0, 0, 8],
                target: [0, 0, 0]
            },
            {
                id: 'camera2',
                type: 'orthogonal',
                left: -5,
                right: 5,
                top: 5,
                bottom: -5,
                near: 0.1,
                far: 100,
                location: [0, 0, 10],
                target: [0, 0, 0]
            }
            // Add more cameras as needed
        ];
        this.contents.configureCameras(initialCameras, 'camera1');
    }

}

export { MyMenu };
