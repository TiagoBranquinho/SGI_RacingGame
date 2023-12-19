import * as THREE from 'three';
import { MyEventHandler } from './MyEventHandler.js';


class MyMenu {

    constructor(contents) {
        this.contents = contents;
        this.menu = new THREE.Group();
        this.intersectObjects = [];
        this.menuHandler = new MyEventHandler(this.contents, this.intersectObjects);
        this.createMenu();
    }

    createMenu() {
        this.initCameras();
        this.addInteractiveSquare('Car 1', 't08g01/textures/menu/car1.jpg', new THREE.Vector3(-3, 0, 0));
        this.addInteractiveSquare('Car 2', 't08g01/textures/menu/car2.jpg', new THREE.Vector3(3, 0, 0));
    }

    draw(obj){
        this.intersectObjects.push(obj);
        this.menu.add(obj);
    }

    display() {
        this.contents.app.scene.add(this.menu);
    }

    addInteractiveSquare(label, textureSrc, position) {
        const squareGeometry = new THREE.PlaneGeometry(4, 4); // Adjust the size as needed
        const texture = new THREE.TextureLoader().load(textureSrc);
        const squareMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);

        squareMesh.position.copy(position);
        squareMesh.name = label;
        squareMesh.userData.textureSrc = textureSrc;

        this.draw(squareMesh);
    }

    initCameras(){
        const initialCameras = [
            {
                id: 'camera1',
                type: 'perspective',
                angle: 75,
                near: 0.1,
                far: 1000,
                location: [2, 2, 2],
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
