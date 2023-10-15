import * as THREE from 'three';
import { MyTable } from './MyTable.js';
import { MyChair } from './MyChair.js';
import { MyBalloon } from './MyBallon.js';
import { MyPhotograph } from './MyPhotograph.js';
import { MyWindow } from './MyWindow.js';
import { MyCarocha } from './MyCarocha.js';
import { MyJournal } from './MyJournal.js';
import { MyJar } from './MyJar.js';
import { MyCarpet } from './MyCarpet.js';


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
        this.table.tableMesh.receiveShadow = true;
        this.table.tableMesh.castShadow = true;
        this.chair1 = new MyChair(this.app)
        this.chair1.init()
        this.chair1.chairMesh.receiveShadow = true;
        this.chair1.chairMesh.castShadow = true;
        this.chair2 = new MyChair(this.app)
        this.chair2.init()
        this.chair2.chairMesh.receiveShadow = true;
        this.chair2.chairMesh.castShadow = true;
        this.ballon1 = new MyBalloon(this.app)
        this.ballon1.init()
        this.ballon1.balloonMesh.receiveShadow = true;
        this.ballon1.balloonMesh.castShadow = true;
        this.ballon2 = new MyBalloon(this.app)
        this.ballon2.init()
        this.ballon2.balloonMesh.receiveShadow = true;
        this.ballon2.balloonMesh.castShadow = true;
        this.ballon3 = new MyBalloon(this.app)
        this.ballon3.init()
        this.ballon3.balloonMesh.receiveShadow = true;
        this.ballon3.balloonMesh.castShadow = true;
        this.ballon4 = new MyBalloon(this.app)
        this.ballon4.init()
        this.ballon4.balloonMesh.receiveShadow = true;
        this.ballon4.balloonMesh.castShadow = true;
        this.photo1 = new MyPhotograph(this.app, 'textures/mongo1.jpg')
        this.photo1.init()
        this.photo1.frameMesh.receiveShadow = true;
        this.photo1.frameMesh.castShadow = true;
        this.photo2 = new MyPhotograph(this.app, 'textures/mongo2.jpg')
        this.photo2.init()
        this.photo2.frameMesh.receiveShadow = true;
        this.photo2.frameMesh.castShadow = true;
        this.window = new MyWindow(this.app)
        this.window.init()
        this.carocha = new MyCarocha(this.app)
        this.carocha.init()
        this.carocha.frameMesh.receiveShadow = true;
        this.carocha.frameMesh.castShadow = true;
        this.jar = new MyJar(this.app)
        this.jar.init()
        this.jar.jarFlowerGroup.receiveShadow = true;
        this.jar.jarFlowerGroup.castShadow = true;
        this.carpet = new MyCarpet(this.app)
        this.carpet.init()
        

        // reposition elements
        this.chair2.chairMesh.position.set(-7, 0, -2)
        this.chair2.chairMesh.rotation.y = Math.PI/2

        this.ballon2.balloonMesh.position.set(-7, 3, -6)
        this.ballon3.balloonMesh.position.set(-7, 3, 6)
        this.ballon4.balloonMesh.position.set(-7, 3, 8)

        this.photo2.frameMesh.position.set(10, 3, 2)

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

        this.roomMesh = new THREE.Group();

    }

    /**
     * builds the box mesh with material assigned
     */
    buildFloor() {
        let floorMaterial = new THREE.MeshPhongMaterial({
            color: "#6E260E",
            specular: "#6E260E", 
            emissive: "#000000", 
            shininess: 20
        })

        let floor = new THREE.PlaneGeometry(10, 10);
        this.floorMesh = new THREE.Mesh(floor, floorMaterial);
        this.floorMesh.receiveShadow = true;
        this.floorMesh.castShadow = true;
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = 0;

        this.floorMesh.scale.set(this.floorMeshSize * 2, this.floorMeshSize * 2)

        this.roomMesh.add(this.floorMesh);
    }

    buildWalls() {
        let wallMaterial = new THREE.MeshPhongMaterial({
            color: "#DFDFDF",
            specular: "#000000", 
            emissive: "#000000", 
            shininess: 10
        })

        let wall = new THREE.PlaneGeometry(20, 5);

        this.wall1Mesh = new THREE.Mesh(wall, wallMaterial);
        this.wall1Mesh.receiveShadow = true;
        this.wall1Mesh.castShadow = false;
        this.wall1Mesh.position.y = 2.5;
        this.wall1Mesh.position.z = -10;

        this.wall2Mesh = new THREE.Mesh(wall, wallMaterial);
        this.wall2Mesh.receiveShadow = true;
        this.wall2Mesh.castShadow = true;
        this.wall2Mesh.position.y = 2.5;
        this.wall2Mesh.position.z = 10;
        this.wall2Mesh.rotation.y = Math.PI;
        

        this.wall3Mesh = new THREE.Mesh(wall, wallMaterial);
        this.wall3Mesh.position.x = -10;
        this.wall3Mesh.position.y = 2.5;
        this.wall3Mesh.rotation.y = Math.PI / 2;
        this.wall3Mesh.receiveShadow = true;
        this.wall3Mesh.castShadow = true;


        this.wall4Mesh = new THREE.Mesh(wall, wallMaterial);
        this.wall4Mesh.receiveShadow = true;
        this.wall4Mesh.castShadow = true;
        this.wall4Mesh.position.x = 10;
        this.wall4Mesh.position.y = 2.5;
        this.wall4Mesh.rotation.y = -Math.PI / 2;

        this.wallsMesh = new THREE.Group();
        this.wallsMesh.add(this.wall1Mesh);
        this.wallsMesh.add(this.wall2Mesh);
        this.wallsMesh.add(this.wall3Mesh);
        this.wallsMesh.add(this.wall4Mesh);

        this.roomMesh.add(this.wallsMesh);

        this.roomMesh.add(this.carpet.carpetMesh);
    }


    /**
     * initializes the contents
     */
    init() {

        this.buildFloor();
        this.buildWalls();

        // Add external elements to room mesh

        this.roomMesh.add(this.table.tableMesh);
        this.roomMesh.add(this.chair1.chairMesh);
        this.roomMesh.add(this.chair2.chairMesh);
        this.roomMesh.add(this.ballon1.balloonMesh);
        this.roomMesh.add(this.ballon2.balloonMesh);
        this.roomMesh.add(this.ballon3.balloonMesh);
        this.roomMesh.add(this.ballon4.balloonMesh);
        this.roomMesh.add(this.photo1.frameMesh);
        this.roomMesh.add(this.photo2.frameMesh);
        this.roomMesh.add(this.window.windowMesh);
        this.roomMesh.add(this.carocha.frameMesh);
        this.roomMesh.add(this.jar.jarFlowerGroup);

        this.app.scene.add(this.roomMesh);
    }

}

export { MyRoom };