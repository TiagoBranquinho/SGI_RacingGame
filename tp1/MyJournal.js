import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

/**
 *  This class contains the contents of out application
 */
class MyJournal {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app

        const map = new THREE.TextureLoader().load('textures/journal.jpg');

        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;
        this.material = new THREE.MeshLambertMaterial({map: map, side: THREE.DoubleSide, transparent: true, opacity: 0.90});

        this.builder = new MyNurbsBuilder()

        this.meshes = new THREE.Group();
        this.samplesU = 8         // maximum defined in MyGuiInterface
        this.samplesV = 8         // maximum defined in MyGuiInterface

        this.init()
    }

    createNurbsSurfaces() {  
        // declare local variables
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 4
        let orderV = 4

        // build nurb #1
        controlPoints =
            [   // U = 0
                [ // V = 0..4;
                    [0.0, 0.0, 0.0, 1 ],
                    [0.0, 1.0, 0.0, 1 ],
                    [0.0, 2.0, 0.0, 1 ],
                    [0.0, 3.0, 0.0, 1 ],
                    [0.0, 4.0, 0.0, 1 ]
                ],

                // U = 1
                [ // V = 0..4
                    [1.0, 0.0, 1.5, 1 ],
                    [1.0, 1.0, 1.5, 1 ],
                    [1.0, 2.0, 1.5, 1 ],
                    [1.0, 3.0, 1.5, 1 ],
                    [1.0, 4.0, 1.5, 1 ]                                                
                ],

                // U = 2
                [ // V = 0..4
                    [2.0, 0.0, 2.0, 1 ],
                    [2.0, 1.0, 2.0, 1 ],
                    [2.0, 2.0, 2.0, 1 ],
                    [2.0, 3.0, 2.0, 1 ],
                    [2.0, 4.0, 2.0, 1 ]                                               
                ],

                // U = 3
                [ // V = 0..4
                    [3.0, 0.0, 1.5, 1 ],
                    [3.0, 1.0, 1.5, 1 ],
                    [3.0, 2.0, 1.5, 1 ],
                    [3.0, 3.0, 1.5, 1 ],
                    [3.0, 4.0, 1.5, 1 ]                                                
                ],
                // U = 4
                [ // V = 0..4
                    [4.0, 0.0, 0.0, 1 ],
                    [4.0, 1.0, 0.0, 1 ],
                    [4.0, 2.0, 0.0, 1 ],
                    [4.0, 3.0, 0.0, 1 ],
                    [4.0, 4.0, 0.0, 1 ]                                                
                ]
            ]

        surfaceData = this.builder.build(controlPoints, orderU, orderV, this.samplesU, this.samplesV, this.material)  

        mesh = new THREE.Mesh(surfaceData, this.material);
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set(0.3*0.5,0.4*0.5,0.3*0.5)

        this.meshes.add(mesh);

        this.meshes.position.set(0.0,0.49,-1.2)
        this.meshes.rotation.x = Math.PI / 2
        this.meshes.rotation.z = -Math.PI / 4
    }

    /**
     * initializes the contents
     */
    init() {
        this.createNurbsSurfaces();
    }

}

export { MyJournal };