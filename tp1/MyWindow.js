import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyWindow {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app

        // table related attributes
        this.windowMesh = null;
        this.windowSize = 1.0;
        this.windowEnabled = true;
        this.lastwindowEnabled = null;
        this.windowDisplacement = new THREE.Vector3(0, 0, 0);

    }

    buildWindow() {
        let windowMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513, // White color
            specular: 0x000000,
            emissive: 0x000000,
            shininess: 40
        });

        let windowWidth = 6;
        let windowHeight = 3;
        let windowDepth = 0.2;

        let windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth);
        this.windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);

        this.windowMesh.position.set(0, 3, -10)

        let textureLoader = new THREE.TextureLoader();
        let viewTexture = textureLoader.load('textures/window.jpg');

        let viewMaterial = new THREE.MeshBasicMaterial({
            map: viewTexture,
            color: 0x8C8C8C
        });

        let viewWidth = windowWidth - 0.1; // Adjust the size of the photo to fit inside the frame
        let viewHeight = windowHeight - 0.1;
        
        let viewGeometry = new THREE.PlaneGeometry(viewWidth, viewHeight);
        
        this.viewMesh = new THREE.Mesh(viewGeometry, viewMaterial);
        
        // Position the photo within the frame
        this.viewMesh.position.set(0, 0, windowDepth / 2 + 0.01); // Slightly in front of the frame

        this.windowMesh.add(this.viewMesh);
    }


    /**
     * initializes the contents
     */
    init() {

        this.buildWindow();
    }

}

export { MyWindow };