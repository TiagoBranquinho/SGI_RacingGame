import * as THREE from 'three';

class MyBalloon {

  constructor(app) {
    this.app = app;
    this.balloonMesh = null;
    this.balloonSize = 1.0;
    this.balloonEnabled = true;
    this.lastBalloonEnabled = null;
    this.balloonDisplacement = new THREE.Vector3(0, 0, 0);
  }

  buildBalloon() {
    let balloonMaterial = new THREE.MeshPhongMaterial({
      color: "#FF0000", // Red color for the balloon
      specular: "#FFFFFF",
      emissive: "#000000",
      shininess: 80
    });

    // Create balloon body
    let balloonGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    this.balloonMesh = new THREE.Mesh(balloonGeometry, balloonMaterial);

    // Position the balloon
    this.balloonMesh.position.set(0, 3, 0);
    this.balloonMesh.scale.set(this.balloonSize, this.balloonSize * 1.2, this.ballonSize)

    // Create rope material
    let ropeMaterial = new THREE.MeshPhongMaterial({
      color: "#FFFFFF",
      specular: "#000000",
      emissive: "#000000",
      shininess: 90
    });

    // Create rope geometry (cylinder)
    let ropeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 16); // Adjust dimensions as needed
    this.ropeMesh = new THREE.Mesh(ropeGeometry, ropeMaterial);

    // Position the rope from the bottom of the balloon
    this.ropeMesh.position.set(0, -1, 0);

    this.balloonMesh.add(this.ropeMesh);

    this.balloonMesh.position.set(-7, 3, -8);

  }

  init() {
    this.buildBalloon();
  }
}

export { MyBalloon };
