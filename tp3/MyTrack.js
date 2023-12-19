import * as THREE from 'three';

class MyTrack {

    constructor(app) {
        this.app = app;

        //Curve related attributes
        this.segments = 200;
        this.width = 8;
        this.textureRepeat = 1;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = true;
        this.closedCurve = false;

        this.path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),   
            new THREE.Vector3(-120, 0, 0),
            new THREE.Vector3(-140, 0, -40),
            new THREE.Vector3(-120, 0, -80),
            new THREE.Vector3(-200, 0, -120),
            new THREE.Vector3(-240, 0, -110),
            new THREE.Vector3(-120, 0, 40),
            new THREE.Vector3(100, 0, 50),
            new THREE.Vector3(110, 0, 150),
            new THREE.Vector3(90, 0, 200),
            new THREE.Vector3(85, 0, 210),
            new THREE.Vector3(95, 0, 230),
            new THREE.Vector3(120, 0, 230),
            new THREE.Vector3(160, 0, 220),
            new THREE.Vector3(150, 0, 0),
            new THREE.Vector3(0, 0, 0)
            
            
        ]);
    }

        /**
     * Creates the necessary elements for the curve
     */
    buildCurve() {
        this.createCurveMaterialsTextures();
        this.createCurveObjects();
    }

    /**
     * Create materials for the curve elements: the mesh, the line and the wireframe
     */
    createCurveMaterialsTextures() {
        const texture = new THREE.TextureLoader().load("t08g01/textures/road.jpg");
        texture.wrapS = THREE.RepeatWrapping;

        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.material.map.repeat.set(3, 3);
        this.material.map.wrapS = THREE.RepeatWrapping;
        this.material.map.wrapT = THREE.RepeatWrapping;

        this.wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        opacity: 0.3,
        wireframe: true,
        transparent: true,
        });

        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    }

    /**
     * Creates the mesh, the line and the wireframe used to visualize the curve
     */
    createCurveObjects() {
        let geometry = new THREE.TubeGeometry(
        this.path,
        this.segments,
        this.width,
        3,
        this.closedCurve
        );
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);

        let points = this.path.getPoints(this.segments);
        let bGeometry = new THREE.BufferGeometry().setFromPoints(points);

        // Create the final object to add to the scene
        this.line = new THREE.Line(bGeometry, this.lineMaterial);

        this.curve = new THREE.Group();

        this.mesh.visible = this.showMesh;
        this.wireframe.visible = this.showWireframe;
        this.line.visible = this.showLine;

        this.curve.add(this.mesh);
        this.curve.add(this.wireframe);
        this.curve.add(this.line);

        this.curve.rotateZ(Math.PI);
        this.curve.scale.set(1,0.2,1);
        this.app.scene.add(this.curve);
    }

    /**
     * Called when user changes number of segments in UI. Recreates the curve's objects accordingly.
     */
    updateCurve() {
        if (this.curve !== undefined && this.curve !== null) {
        this.app.scene.remove(this.curve);
        }
        this.buildCurve();
    }

    /**
     * Called when user curve's closed parameter in the UI. Recreates the curve's objects accordingly.
     */
    updateCurveClosing() {
        if (this.curve !== undefined && this.curve !== null) {
        this.app.scene.remove(this.curve);
        }
        this.buildCurve();
    }

    init() {
        this.buildCurve();
    }

}

export { MyTrack };
