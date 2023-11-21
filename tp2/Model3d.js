import * as THREE from 'three';

export class Model3D extends THREE.Object3D {
    constructor(filepath) {
        super();
        loadModel(filepath);
    }

    loadModel(filepath){
        // Load 3D model
        // You need to implement your own logic for loading 3D models based on the filepath
        const loader = new THREE.OBJLoader(); // Use the appropriate loader for your file format
        loader.load(
            filepath,
            (object) => {
                // Add the loaded 3D model to the scene
                this.add(object);
            },
            (xhr) => {
                // Handle loading progress if needed
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
                console.error('Error loading 3D model', error);
            }
        );

        // Set custom properties
        this.userData = params;

        return this;
    }
}
