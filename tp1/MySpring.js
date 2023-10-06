import * as THREE from 'three';


class MySpring {

  constructor(app) {
    this.app = app;
    this.spring = null;
    this.springSize = 1;
    this.lastSpringEnabled = null;
    this.springDisplacement = new THREE.Vector3(0, 0, 0);
  }

  buildSpring() {
    const springCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 1, 1),
    ]);

    const springGeometry = new THREE.TubeGeometry(springCurve, 200, 0.02, 20, false);

    const springMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    this.spring = new THREE.Mesh(springGeometry, springMaterial);

    this.spring.position.set(0, 5, 0);

  }

  init() {
    this.buildSpring();
  }

  setEnabled(enabled) {
    this.spring.visible = enabled;
  }
}

export { MySpring };
