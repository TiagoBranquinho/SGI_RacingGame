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
        this.app.scene.add(pointLight);

        // Create a spotlight
        const spotLight = new THREE.SpotLight(0xffffff, 20, 1.5, 0.85, 0, 0); // White light
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

        this.buildBox()

        // Create a Plane Mesh with basic material

        let plane = new THREE.PlaneGeometry(10, 10);
        this.planeMesh = new THREE.Mesh(plane, this.planeMaterial);
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        //this.app.scene.add(this.planeMesh);
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

}

export { MyContents };