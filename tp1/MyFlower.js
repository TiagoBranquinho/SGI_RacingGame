import * as THREE from 'three';

class MyFlower {
  constructor(app) {
    this.app = app;
    this.flowerGroup = new THREE.Group();
  }

  createPetals() {
    let textureLoader = new THREE.TextureLoader();
    let viewTexture = textureLoader.load('textures/flower.jpg');
    let petalMaterial = new THREE.MeshPhongMaterial({
      map: viewTexture,
      color: "#ffc0cb",
      specular: "#ffc0cb",
      emissive: "#000000",
      shininess: 10
    });
    const numPetals = 6;
    const petalRadius = 0.5;
    const petalHeight = 0.1;

    for (let i = 0; i < numPetals; i++) {
      const angle = (i / numPetals) * Math.PI * 2;

      const petalGeometry = new THREE.CylinderGeometry(petalRadius, petalRadius, petalHeight, 50);
      const petalMesh = new THREE.Mesh(petalGeometry, petalMaterial);
      petalMesh.receiveShadow = true;
      petalMesh.castShadow = true;

      const distanceFromCenter = 0.5; // Adjust the distance from the center
      petalMesh.position.x = Math.cos(angle) * distanceFromCenter;
      petalMesh.position.y = Math.sin(angle) * distanceFromCenter;
      petalMesh.position.z = - 0.1;
      petalMesh.rotation.z = angle;
      petalMesh.rotateX(Math.PI / 2);
      petalMesh.rotateZ(- Math.PI / 12);
      petalMesh.scale.set(0.9, 0.45, 0.45);

      this.flowerGroup.add(petalMesh);
    }
  }


  createCenter() {
    let textureLoader = new THREE.TextureLoader();
    let viewTexture = textureLoader.load('textures/flower_middle.jpg');
    const centerRadiusTop = 0.2;
    const centerRadiusBottom = 0.2;
    const centerHeight = 0.1;
    const centerSegments = 50;
    const centerGeometry = new THREE.CylinderGeometry(centerRadiusTop, centerRadiusBottom, centerHeight, centerSegments);
    let centerMaterial = new THREE.MeshPhongMaterial({
      map: viewTexture,
      color: "#FFFF00",
      specular: "#FFFF00",
      emissive: "#000000",
      shininess: 10
    });    const centerCylinder = new THREE.Mesh(centerGeometry, centerMaterial);
    centerCylinder.rotateX(Math.PI / 2);
    this.flowerGroup.add(centerCylinder);
  }

  createStem() {
    let stemMaterial = new THREE.LineBasicMaterial({
      color: "#2f540e",
    });
  
    // Adjust the stem points for the desired curvature
    const stemPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 5, 0), // Adjust stem height
      new THREE.Vector3(0, 7, -1), // Adjust stem height and curvature
      new THREE.Vector3(0, 10, -2), // Further adjust stem height and curvature
    ];
  
    const stemSpline = new THREE.CatmullRomCurve3(stemPoints);
    const stemGeometry = new THREE.BufferGeometry().setFromPoints(stemSpline.getPoints(50));
  
    const stemLine = new THREE.Line(stemGeometry, stemMaterial);
    stemLine.castShadow = true;
    stemLine.receiveShadow = true;
    stemLine.scale.set(1, 0.2, 1);
    stemLine.rotateX(Math.PI / 2);
    this.flowerGroup.add(stemLine);
  
    this.flowerGroup.position.set(0, 4, 0);
  
    this.flowerGroup.rotation.x = Math.PI / 4;
    this.flowerGroup.rotation.y = Math.PI / 4;
    this.flowerGroup.rotation.z = 3 * Math.PI / 4;
  }
  

  init() {
    this.createPetals();
    this.createCenter();
    this.createStem();
  }

  setEnabled(enabled) {
    this.flowerGroup.visible = enabled;
  }
}

export { MyFlower };
