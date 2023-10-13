import * as THREE from 'three';

class MyCarpet {

  constructor(app) {
    this.app = app;
    this.carpetSize = 1;
    this.carpetEnabled = true;
    this.lastCarpetEnabled = null;
    this.carpetDisplacement = new THREE.Vector3(0, 0, 0);
    this.carpetMesh = null;
  }

  buildCarpet() {
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

  }

  init() {
    this.buildPlate();
  }
}

export { MyCarpet };
