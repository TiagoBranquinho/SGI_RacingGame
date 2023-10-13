import * as THREE from 'three';

class MyCarpet {

  constructor(app) {
    this.app = app;
    this.carpetSize = 1.5;
    this.carpetEnabled = true;
    this.lastCarpetEnabled = null;
    this.carpetDisplacement = new THREE.Vector3(0, 0, 0);
    this.carpetMesh = null;
  }

  buildCarpet() {
    let carpetMaterial = new THREE.MeshPhongMaterial({
      color: 0xf75959, // red color
      specular: 0x000000,
      emissive: 0x000000,
      shininess: 60
    });
    let carpetWidth = 6;
    let carpetHeight = 3;
    let carpetDepth = 0.1;

    let carpetGeometry = new THREE.BoxGeometry(carpetWidth, carpetHeight, carpetDepth);
    this.carpetMesh = new THREE.Mesh(carpetGeometry, carpetMaterial);

    let textureLoader = new THREE.TextureLoader();
    let viewTexture = textureLoader.load('textures/carpet.jpg');

    let viewMaterial = new THREE.MeshBasicMaterial({
      map: viewTexture,
      color: 0xf75959,
    });

    let viewGeometry = new THREE.PlaneGeometry(carpetWidth, carpetHeight);

    this.viewMesh = new THREE.Mesh(viewGeometry, viewMaterial);
    this.viewMesh.position.set(0, 0, carpetDepth / 2 + 0.01);

    this.carpetMesh.add(this.viewMesh);

    this.carpetMesh.position.set(4, 0, 0);
    this.carpetMesh.scale.set(this.carpetSize, this.carpetSize, this.carpetSize);

    this.carpetMesh.rotation.x = - Math.PI / 2;
    this.carpetMesh.rotation.z = - Math.PI / 2;

  }

  init() {
    this.buildCarpet();
  }
}

export { MyCarpet };
