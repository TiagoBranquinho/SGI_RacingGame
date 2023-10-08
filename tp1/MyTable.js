import * as THREE from 'three';

import { MyPlate } from './MyPlate.js';

import { MySpring } from './MySpring.js';


/**
 *  This class contains the contents of out application
 */
class MyTable {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app

        // table related attributes
        this.tableMesh = null;
        this.tableSize = 1.0;
        this.tableEnabled = true;
        this.lastTableEnabled = null;
        this.tableDisplacement = new THREE.Vector3(0, 0, 0);
        this.plate = null;
        this.spring = null;

    }

    buildTable() {
        // Load the wood texture image
        let textureLoader = new THREE.TextureLoader();
        let woodTexture = textureLoader.load('textures/wood.webp');

        let tableMaterial = new THREE.MeshPhongMaterial({
            map: woodTexture, // Use the wood texture as the map
            color: "#8B4513", // Brown color for the table
            specular: "#8B4513",
            emissive: "#000000",
            shininess: 30
        });

        let tableTop = new THREE.BoxGeometry(3, 0.5, 3); // Adjust the dimensions as needed
        this.tableMesh = new THREE.Mesh(tableTop, tableMaterial);
        this.tableMesh.position.set(0, 1.8, 0); // Position the table top at a suitable height

        // Create table legs
        let legMaterial = new THREE.MeshPhongMaterial({
            color: "#8B4513", // Use the same color as the table top
            specular: "#8B4513",
            emissive: "#000000",
            shininess: 30
        });

        // Define leg dimensions
        let legWidth = 0.2;
        let legHeight = 1.7;
        let legDepth = 0.2;

        // Create table legs
        let leg = new THREE.BoxGeometry(legWidth, legHeight, legDepth);

        // Create leg meshes and add them to the table group
        let tableLeg1 = new THREE.Mesh(leg, legMaterial);
        let tableLeg2 = new THREE.Mesh(leg, legMaterial);
        let tableLeg3 = new THREE.Mesh(leg, legMaterial);
        let tableLeg4 = new THREE.Mesh(leg, legMaterial);

        tableLeg1.position.set(-1.4, -1.1, -1.4);
        tableLeg2.position.set(-1.4, -1.1, 1.4);
        tableLeg3.position.set(1.4, -1.1, -1.4);
        tableLeg4.position.set(1.4, -1.1, 1.4);

        this.tableMesh.add(tableLeg1);
        this.tableMesh.add(tableLeg2);
        this.tableMesh.add(tableLeg3);
        this.tableMesh.add(tableLeg4);

        this.plate = new MyPlate(this.app);
        this.plate.init();

        this.spring = new MySpring(this.app);
        this.spring.init();


        this.tableMesh.position.set(-4, 1.8, 0)

        this.tableMesh.scale.set(this.tableSize, this.tableSize, this.tableSize * 2.5); 
        this.tableMesh.add(this.plate.plateGroup);
        this.tableMesh.add(this.spring.springMesh);
    }


    /**
     * initializes the contents
     */
    init() {

        this.buildTable();
    }

}

export { MyTable };