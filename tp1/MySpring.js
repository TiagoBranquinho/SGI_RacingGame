import * as THREE from 'three';


class MySpring {

  constructor(app) {
    this.app = app;
    this.springMesh = null;
    this.springGroup;
    this.springSize = 1;
    this.lastSpringEnabled = null;
    this.springDisplacement = new THREE.Vector3(0, 0, 0);
  }

  buildSpring() {
    // Define the number of steps and parameters for the circular staircase
    const numSteps = 30;
    const numFloors = 8; // Number of floors
    const radius = 0.15;
    const floorHeight = 0.25;

    // Create an array to hold the vertices of the staircase
    let vertices = [];

    for (let j = 0; j < numFloors; j++) {
      for (let i = 0; i < numSteps; i++) {
        const angle = (i / numSteps) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = j * floorHeight + (i / numSteps) * floorHeight;

        vertices.push(x, y, z);
      }
    }

    // Create the geometry for the circular staircase
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Create the material for the staircase
    const material = new THREE.LineBasicMaterial({ color: 0x969693});

    // Create the line from material and geometry
    this.springMesh = new THREE.Line(geometry, material);
    this.springMesh.position.set(0, 0, 1);

    // Create a group to hold the spring mesh
    this.springGroup = new THREE.Group();
    this.springGroup.add(this.springMesh);
  }


  init() {
    this.buildSpring();
  }

  setEnabled(enabled) {
    this.spring.visible = enabled;
  }
}

export { MySpring };

