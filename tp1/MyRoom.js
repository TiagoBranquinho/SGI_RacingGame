import * as THREE from 'three';
import { MyTable } from './MyTable.js';
import { MyChair } from './MyChair.js';

/**
 *  This class contains the contents of out application
 */
class MyRoom {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.table = new MyTable(this.app)
        this.table.init()
        this.chair = new MyChair(this.app)
        this.chair.init()

        // floor related attributes
        this.floorMesh = null
        this.floorMeshSize = 1.0
        this.floorEnabled = true
        this.lastfloorEnabled = null
        this.floorDisplacement = new THREE.Vector3(0, 0, 0)

        // walls related attributes
        this.wall1Mesh = null
        this.wall1MeshSize = 1.0
        this.wall1Enabled = true
        this.lastwall1Enabled = null
        this.wall1Displacement = new THREE.Vector3(0, 0, 0)

        this.wall2Mesh = null
        this.wall2MeshSize = 1.0
        this.wall2Enabled = true
        this.lastwall2Enabled = null
        this.wall2Displacement = new THREE.Vector3(0, 0, 0)

        this.wall3Mesh = null
        this.wall3MeshSize = 1.0
        this.wall3Enabled = true
        this.lastwall3Enabled = null
        this.wall3Displacement = new THREE.Vector3(0, 0, 0)

        this.wall4Mesh = null
        this.wall4MeshSize = 1.0
        this.wall4Enabled = true
        this.lastwall4Enabled = null
        this.wall4Displacement = new THREE.Vector3(0, 0, 0)

    }

    /**
     * builds the box mesh with material assigned
     */
    buildFloor() {
        let floorMaterial = new THREE.MeshPhongMaterial({
            color: "#6E260E",
            specular: "#000000", emissive: "#000000", shininess: 90
        })

        let floor = new THREE.PlaneGeometry(10, 10);
        this.floorMesh = new THREE.Mesh(floor, floorMaterial);
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = 0;
    }

    buildWalls() {
        let wallMaterial = new THREE.MeshPhongMaterial({
            color: "#DFDFDF",
            specular: "#000000", emissive: "#000000", shininess: 90
        })

        let wall = new THREE.PlaneGeometry(10, 5);

        this.wall1Mesh = new THREE.Mesh(wall, wallMaterial);
        this.wall1Mesh.position.y = 2.5;
        this.wall1Mesh.position.z = -5;

        this.wall2Mesh = new THREE.Mesh(wall, wallMaterial);
        this.wall2Mesh.position.y = 2.5;
        this.wall2Mesh.position.z = 5;
        this.wall2Mesh.rotation.y = Math.PI;

        this.wall3Mesh = new THREE.Mesh(wall, wallMaterial);
        this.wall3Mesh.position.x = -5;
        this.wall3Mesh.position.y = 2.5;
        this.wall3Mesh.rotation.y = Math.PI / 2;


        this.wall4Mesh = new THREE.Mesh(wall, wallMaterial);
        this.wall4Mesh.position.x = 5;
        this.wall4Mesh.position.y = 2.5;
        this.wall4Mesh.rotation.y = -Math.PI / 2;
    }


    /**
     * initializes the contents
     */
    init() {

        this.buildFloor();
        this.buildWalls();

        // Create a Plane Mesh with basic material

        this.app.scene.add(this.floorMesh)

        this.app.scene.add(this.wall1Mesh)
        this.app.scene.add(this.wall2Mesh)
        this.app.scene.add(this.wall3Mesh)
        this.app.scene.add(this.wall4Mesh)
    }

}

export { MyRoom };