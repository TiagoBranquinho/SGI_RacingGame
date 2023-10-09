import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyFlower } from './MyFlower.js';

/**
 *  This class contains the contents of out application
 */
class MyJar {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app

        const map = new THREE.TextureLoader().load('textures/jar.avif');

        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;
        this.material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide, transparent: true, opacity: 0.90 });

        this.builder = new MyNurbsBuilder()

        this.meshes = new THREE.Group();
        this.samplesU = 8         // maximum defined in MyGuiInterface
        this.samplesV = 8         // maximum defined in MyGuiInterface
        this.jarFlowerGroup = new THREE.Group();

        this.init()
    }

    createNurbsSurfaces() {
        // declare local variables
        let controlPoints1;
        let surfaceData1;
        let mesh1;
        let orderU = 4
        let orderV = 4

        // build nurb #1
        controlPoints1 = [
            // U = 0
            [
                [1.0, 0.0, 0.0, 1],
                [1.0, 1.0, 0.0, 1],
                [1.0, 2.0, 0.0, 1],
                [1.0, 3.0, 0.0, 1],
                [1.0, 4.0, 0.0, 1]
            ],

            // U = 1
            [
                [1.0, 0.0, 1.0, 1],
                [1.0, 1.0, 2.0, 1],
                [1.0, 2.0, 3.0, 1],
                [1.0, 3.0, 2.0, 1],
                [1.0, 4.0, 1.0, 1]
            ],

            // U = 2
            [
                [2.0, 0.0, 3.0, 1],
                [2.0, 1.0, 2.0, 1],
                [2.0, 2.0, 4.0, 1],
                [2.0, 3.0, 2.0, 1],
                [2.0, 4.0, 3.0, 1]
            ],

            // U = 3
            [
                [3.0, 0.0, 1.0, 1],
                [3.0, 1.0, 2.0, 1],
                [3.0, 2.0, 3.0, 1],
                [3.0, 3.0, 2.0, 1],
                [3.0, 4.0, 1.0, 1]
            ],
            // U = 4
            [
                [3.0, 0.0, 0.0, 1],
                [3.0, 1.0, 0.0, 1],
                [3.0, 2.0, 0.0, 1],
                [3.0, 3.0, 0.0, 1],
                [3.0, 4.0, 0.0, 1]
            ]
        ];


        surfaceData1 = this.builder.build(controlPoints1, orderU, orderV, this.samplesU, this.samplesV, this.material)

        mesh1 = new THREE.Mesh(surfaceData1, this.material);
        mesh1.rotation.x = 0
        mesh1.rotation.y = 0
        mesh1.rotation.z = 0
        mesh1.scale.set(1, 1, 1)

        this.meshes.add(mesh1);

        let controlPoints2;
        let surfaceData2;
        let mesh2;

        // build nurb #2
        controlPoints2 = [
            // U = 0
            [
                [1.0, 0.0, 0.0, 1],
                [1.0, 1.0, 0.0, 1],
                [1.0, 2.0, 0.0, 1],
                [1.0, 3.0, 0.0, 1],
                [1.0, 4.0, 0.0, 1]
            ],

            // U = 1
            [
                [1.0, 0.0, -1.0, 1],
                [1.0, 1.0, -2.0, 1],
                [1.0, 2.0, -3.0, 1],
                [1.0, 3.0, -2.0, 1],
                [1.0, 4.0, -1.0, 1]
            ],

            // U = 2
            [
                [2.0, 0.0, -3.0, 1],
                [2.0, 1.0, -2.0, 1],
                [2.0, 2.0, -4.0, 1],
                [2.0, 3.0, -2.0, 1],
                [2.0, 4.0, -3.0, 1]
            ],

            // U = 3
            [
                [3.0, 0.0, -1.0, 1],
                [3.0, 1.0, -2.0, 1],
                [3.0, 2.0, -3.0, 1],
                [3.0, 3.0, -2.0, 1],
                [3.0, 4.0, -1.0, 1]
            ],
            // U = 4
            [
                [3.0, 0.0, 0.0, 1],
                [3.0, 1.0, 0.0, 1],
                [3.0, 2.0, 0.0, 1],
                [3.0, 3.0, 0.0, 1],
                [3.0, 4.0, 0.0, 1]
            ]
        ];


        surfaceData2 = this.builder.build(controlPoints2, orderU, orderV, this.samplesU, this.samplesV, this.material)

        mesh2 = new THREE.Mesh(surfaceData2, this.material);
        mesh2.rotation.x = 0
        mesh2.rotation.y = 0
        mesh2.rotation.z = 0
        mesh2.scale.set(1, 1, 1)

        this.meshes.add(mesh2);

        this.meshes.scale.set(0.6, 0.6, 0.5)
        this.jarFlowerGroup.position.set(8, 0, 8)
        this.meshes.rotation.y = -Math.PI / 4
        const flower = new MyFlower(this.app);
        flower.init();
        this.jarFlowerGroup.add(flower.flowerGroup);
        this.jarFlowerGroup.add(this.meshes);
        //this.meshes.rotation.z = -Math.PI / 4
    }

    /**
     * initializes the contents
     */
    init() {
        this.createNurbsSurfaces();
    }

}

export { MyJar };
