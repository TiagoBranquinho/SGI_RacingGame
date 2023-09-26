import * as THREE from 'three';

/**
 *  This class contains the contents of our application
 */
class MyChair {

  /**
   * Constructs the object
   * @param {MyApp} app The application object
   */
  constructor(app) {
    this.app = app

    // Chair related attributes
    this.chairMesh = null;
    this.chairSize = 1.0;
    this.chairEnabled = true;
    this.lastChairEnabled = null;
    this.chairDisplacement = new THREE.Vector3(0, 0, 0);

  }

  buildChair() {
    let chairMaterial = new THREE.MeshPhongMaterial({
      color: "#6E260E", // Adjust the color as needed
      specular: "#000000",
      emissive: "#000000",
      shininess: 90
    });

    // Create chair seat and backrest
    let seatGeometry = new THREE.BoxGeometry(1, 0.1, 1);
    let backrestGeometry = new THREE.BoxGeometry(1, 0.5, 0.1);

    let seatMesh = new THREE.Mesh(seatGeometry, chairMaterial);
    let backrestMesh = new THREE.Mesh(backrestGeometry, chairMaterial);

    // Position seat and backrest
    seatMesh.position.set(0, 0.25, 0);
    backrestMesh.position.set(0, 0.55, -0.45);

    // Create chair legs
    let legMaterial = new THREE.MeshPhongMaterial({
      color: "#6E260E", // Use the same color as the seat
      specular: "#000000",
      emissive: "#000000",
      shininess: 90
    });

    let legWidth = 0.1;
    let legHeight = 0.3;
    let legDepth = 0.1;

    let legGeometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);

    let chairLeg1 = new THREE.Mesh(legGeometry, legMaterial);
    let chairLeg2 = new THREE.Mesh(legGeometry, legMaterial);
    let chairLeg3 = new THREE.Mesh(legGeometry, legMaterial);
    let chairLeg4 = new THREE.Mesh(legGeometry, legMaterial);

    // Position chair legs
    chairLeg1.position.set(-0.45, 0.15, -0.45);
    chairLeg2.position.set(-0.45, 0.15, 0.45);
    chairLeg3.position.set(0.45, 0.15, -0.45);
    chairLeg4.position.set(0.45, 0.15, 0.45);

    // Create chair group and add components
    this.chairMesh = new THREE.Group();
    this.chairMesh.add(seatMesh);
    this.chairMesh.add(backrestMesh);
    this.chairMesh.add(chairLeg1);
    this.chairMesh.add(chairLeg2);
    this.chairMesh.add(chairLeg3);
    this.chairMesh.add(chairLeg4);
  }

  /**
   * Initializes the contents
   */
  init() {
    this.buildChair();
    this.app.scene.add(this.chairMesh);
  }

}

export { MyChair };
