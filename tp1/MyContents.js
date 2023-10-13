import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyRoom } from './MyRoom.js';

/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.axis = null;
        this.candleEnabled = true;
        this.cakeSliceEnabled = true;
        this.cakeBigPortionEnabled = true;
        this.plateEnabled = true;
        this.tableEnabled = true;
        this.decorationEnabled = true;

        this.room = new MyRoom(this.app)
        this.room.init()

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0, 2, 0)


        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess
        })

        this.mapSize = 4096
        this.nbrPolyg = 10
        this.volumeDimX = 10
        this.volumeDimY = 10
        this.volumeDimZ = 10
        this.volumeMeshes = []
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000", emissive: "#000000", shininess: 90
        })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(this.boxMeshSize, this.boxMeshSize, this.boxMeshSize);
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    buildCylinder() {
        let cylinder = new THREE.CylinderGeometry({
            radiusTop: 4, radiusBottom: 4, height: 8,
            radialSegments: 12, heightSegments: 2,
            openEnded: false,
            thetaStart: Math.PI * 0.25, thetaLength: Math.PI * 1.5
        });
    }

    buildRectangle(height, width) {
        let rectangle = new THREE.PlaneGeometry(height, width);
    }

    /**
     * initializes the contents
     */
    init() {

        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight(0xffffff, 500, 0);
        pointLight.position.set(0, 20, 0);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = this.mapSize;
        pointLight.shadow.mapSize.height = this.mapSize;
        pointLight.shadow.camera.near = 0.5;
        pointLight.shadow.camera.far = 100;
        this.app.scene.add(pointLight);

        // Create a spotlight
        const spotLight = new THREE.SpotLight(0xffffff, 20, 1.5, 0.80, 0, 0); // White light
        spotLight.position.set(-4, 3.5, 0); // Set the position of the spotlight
        spotLight.castShadow = true; // Enable shadow casting
        spotLight.target = this.room.table.plate.cake.cakeGroup; // Define the target of the spotlight
        this.app.scene.add(spotLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.app.scene.add(pointLightHelper);

        const spotlightHelper = new THREE.SpotLightHelper(spotLight);
        this.app.scene.add(spotlightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);


        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(0, 3, -9.8);
        directionalLight.target = this.room.wall2Mesh;
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = this.mapSize;
        directionalLight.shadow.mapSize.height = this.mapSize;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -15;
        directionalLight.shadow.camera.right = 15;
        directionalLight.shadow.camera.bottom = -15;
        directionalLight.shadow.camera.top = 15;

        this.app.scene.add(directionalLight);

        const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
        this.app.scene.add(directionalLightHelper);

        this.buildBox()

        // Create a Plane Mesh with basic material

        let plane = new THREE.PlaneGeometry(10, 10);
        this.planeMesh = new THREE.Mesh(plane, this.planeMaterial);
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        //this.app.scene.add(this.planeMesh);
    }

    rebuildVolume() {
        for ( let i = 0; i < this.nbrPolyg; i ++ ) {
            if (this.volumeMeshes[i] !== null) {
                this.app.scene.remove(this.volumeMeshes[i])
            }
        }
            this.buildVolume()
    }

   

    buildVolume() {
        const volumeDimXd2 = this.volumeDimX / 2
        const volumeDimYd2 = this.volumeDimY / 2
        const volumeDimZd2 = this.volumeDimZ / 2

        const maxDimX = this.volumeDimX / 3
        const maxDimY = this.volumeDimY / 3

        for (let i = 0; i < this.nbrPolyg; i ++) {
            const dimX = maxDimX * Math.random()
            const dimY = maxDimY * Math.random()

            const rotX = 2 * Math.PI * Math.random()
            const rotY = 2 * Math.PI * Math.random()
            const rotZ = 2 * Math.PI * Math.random()

            const posX = this.volumeDimX * Math.random() - volumeDimXd2
            const posY = this.volumeDimY * Math.random() - volumeDimYd2
            const posZ = this.volumeDimZ * Math.random() - volumeDimZd2

            const colorR = Math.random()
            const colorG = Math.random()
            const colorB = Math.random()
            const colorP = new THREE.Color(colorR, colorG, colorB);
            var smallP = new THREE.PlaneGeometry( dimX, dimY )
            this.volumeMeshes[i] = new THREE.Mesh(smallP, new THREE.MeshStandardMaterial({color: colorP}) )
            this.volumeMeshes[i].rotation.x = rotX
            this.volumeMeshes[i].rotation.y = rotY
            this.volumeMeshes[i].rotation.z = rotZ  
            this.volumeMeshes[i].position.x = posX
            this.volumeMeshes[i].position.y = posY
            this.volumeMeshes[i].position.z = posZ
            this.volumeMeshes[i].receiveShadow = true
            this.volumeMeshes[i].castShadow = true
            this.app.scene.add( this.volumeMeshes[i] )
        }
    }

    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }

    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }

    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        //this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        //this.boxMesh.position.x = this.boxDisplacement.x
        //this.boxMesh.position.y = this.boxDisplacement.y
        //this.boxMesh.position.z = this.boxDisplacement.z

    }

    enableCandle() {
        this.room.table.plate.cake.candle.candleGroup.visible = this.candleEnabled;
    }

    enableCakeSlice() {
        this.room.table.plate.cake.cakeGroup.children[1].visible = this.cakeSliceEnabled;
    }

    enableBigCake() {
        this.room.table.plate.cake.cakeGroup.children[0].visible = this.cakeBigPortionEnabled;
    }

    enablePlate() {
        this.room.table.plate.plateGroup.visible = this.plateEnabled;
    }

    enableTable() {
        this.room.table.tableMesh.visible = this.tableEnabled;
        this.room.chair1.chairMesh.visible = this.tableEnabled;
        this.room.chair2.chairMesh.visible = this.tableEnabled;
    }

    enableDecoration() {
        this.room.window.windowMesh.visible = this.decorationEnabled;
        this.room.ballon1.balloonMesh.visible = this.decorationEnabled;
        this.room.ballon2.balloonMesh.visible = this.decorationEnabled;
        this.room.ballon3.balloonMesh.visible = this.decorationEnabled;
        this.room.ballon4.balloonMesh.visible = this.decorationEnabled;
        this.room.photo1.frameMesh.visible = this.decorationEnabled;
        this.room.photo2.frameMesh.visible = this.decorationEnabled;
    }

}

export { MyContents };