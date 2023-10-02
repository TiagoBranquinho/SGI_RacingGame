import * as THREE from 'three';
import { MyCake } from './MyCake.js';

class MyPlate {

  constructor(app) {
    this.app = app;
    this.plateSize = 1;
    this.plateEnabled = true;
    this.lastPlateEnabled = null;
    this.plateDisplacement = new THREE.Vector3(0, 0, 0);
    this.plateMesh = null;
    this.plateGroup = null;
    this.cake = null;
  }

  buildPlate() {
    const plateMaterial = new THREE.MeshPhongMaterial({
      color: "#808080",
      specular: "#d9c7c5",
      emissive: "#d9c7c5",
      shininess: 30
    });

    const plateRadiusTop = 1;
    const plateRadiusBottom = 1;
    const plateHeight = 0.10;
    const plateSegments = 13;

    const plateGeometry = new THREE.CylinderGeometry(
      plateRadiusTop,
      plateRadiusBottom,
      plateHeight,
      plateSegments
    );

    this.plateMesh = new THREE.Mesh(plateGeometry, plateMaterial);

    this.plateMesh.scale.set(this.plateSize, this.plateSize, this.plateSize);
    this.plateMesh.position.set(0, -0.01, 0);
    this.plateMesh.scale.set(1.4, 1, 1.4);
    this.plateGroup = new THREE.Group();

    this.cake = new MyCake(this.app);
    this.cake.init();

    this.plateGroup.add(this.cake.cakeGroup);
    
    this.plateGroup.add(this.plateMesh);

    this.plateGroup.position.set(0, 0.3, 0);

    this.plateGroup.scale.set(this.plateSize, this.plateSize, this.plateSize/2.5);

  }

  init() {
    this.buildPlate();
  }
}

export { MyPlate };
