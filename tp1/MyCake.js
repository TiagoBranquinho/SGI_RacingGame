import * as THREE from 'three';
import { MyCandle } from './MyCandle.js';


class MyCake {

  constructor(app) {
    this.app = app;
    this.cakeGroup = null;
    this.candle = null;
    this.bigPortionGroup = null;
    this.cakeSize = 1;
    this.cakeEnabled = true;
    this.lastCakeEnabled = null;
    this.cakeDisplacement = new THREE.Vector3(0, 0, 0);
    this.sliceAngle = Math.PI * 1.60;
    this.sliceMesh = null;
  }

  buildCake() {
    let cakeMaterial = new THREE.MeshPhongMaterial({
      color: "#C70039",
      specular: "#FC1703",
      emissive: "#000000",
      shininess: 10
    });

    let cakeShape = new THREE.Shape();
    cakeShape.moveTo(0, 0); // Move to the center
    cakeShape.lineTo(1, 0); // Line to the outer edge
    cakeShape.absarc(0, 0, 1, 0, this.sliceAngle, false);

    // Create geometry by extruding the shape
    const cakeGeometry = new THREE.ExtrudeGeometry(cakeShape, {
      steps: 1,
      depth: 0.5,
      bevelEnabled: false,
    });

    const cakeMesh = new THREE.Mesh(cakeGeometry, cakeMaterial);



    let sliceShape = new THREE.Shape();
    sliceShape.moveTo(0, 0); // Move to the center
    sliceShape.lineTo(1, 0); // Line to the outer edge
    sliceShape.absarc(0, 0, 1, 0, -this.sliceAngle, false);

    // Create geometry by extruding the shape
    const sliceGeometry = new THREE.ExtrudeGeometry(sliceShape, {
      steps: 1,
      depth: 0.5,
      bevelEnabled: false,
    });

    this.sliceMesh = new THREE.Mesh(sliceGeometry, cakeMaterial);


    // Position Cake and slice so it appears that the slice is cut out of the cake
    cakeMesh.position.set(0, 0, 0);
    this.sliceMesh.position.set(0.2, 0, 0.2);



    cakeMesh.rotation.x = -Math.PI / 2;

    this.sliceMesh.rotation.x = -Math.PI / 2;
    this.sliceMesh.rotation.z = this.sliceAngle;





    this.candle = new MyCandle(this.app);
    this.candle.init();
    this.cakeGroup = new THREE.Group();

    this.bigPortionGroup = new THREE.Group();
    this.bigPortionGroup.add(cakeMesh);



    this.bigPortionGroup.add(this.candle.candleGroup);
    this.cakeGroup.add(this.bigPortionGroup);
    this.cakeGroup.add(this.sliceMesh);
    this.cakeGroup.position.set(0, 0.05, 0);
    this.cakeGroup.scale.set(this.cakeSize, this.cakeSize, this.cakeSize);
  }

  init() {
    this.buildCake();
  }
}

export { MyCake };
