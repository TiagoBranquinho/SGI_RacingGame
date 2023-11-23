import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class MyModel3D extends THREE.Object3D {
    constructor() {
        super();
    }

    static async loadModel(filepath) {
        const loader = new GLTFLoader();
        return loader.loadAsync(filepath);
    }
}
