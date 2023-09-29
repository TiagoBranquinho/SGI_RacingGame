import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyPhotograph {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param photoTexture Picture to be shown
    */
    constructor(app, photoTexture) {
        this.app = app

        // table related attributes
        this.frameMesh = null;
        this.frameSize = 1.0;
        this.frameEnabled = true;
        this.lastframeEnabled = null;
        this.frameDisplacement = new THREE.Vector3(0, 0, 0);
        this.textureLoader = new THREE.TextureLoader();
        this.photoTexture = this.textureLoader.load(photoTexture);

    }

    buildPhoto() {
        let frameMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513, // Brown color for wood-like appearance
            specular: 0x000000,
            emissive: 0x000000,
            shininess: 90
        });

        let frameWidth = 2;
        let frameHeight = 2;
        let frameDepth = 0.2;

        let frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, frameDepth);
        this.frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);

        this.frameMesh.rotation.y = -Math.PI/2
        this.frameMesh.position.set(10, 3, -2)

        let photoMaterial = new THREE.MeshBasicMaterial({
            map: this.photoTexture,
        });

        let photoWidth = frameWidth - 0.1; // Adjust the size of the photo to fit inside the frame
        let photoHeight = frameHeight - 0.1;
        
        let photoGeometry = new THREE.PlaneGeometry(photoWidth, photoHeight);
        
        this.pictureMesh = new THREE.Mesh(photoGeometry, photoMaterial);
        
        // Position the photo within the frame
        this.pictureMesh.position.set(0, 0, frameDepth / 2 + 0.01); // Slightly in front of the frame

        this.frameMesh.add(this.pictureMesh);
    }


    /**
     * initializes the contents
     */
    init() {

        this.buildPhoto();
    }

}

export { MyPhotograph };