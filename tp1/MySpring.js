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

  buildSpringPart() {
    // Define points for the vertical spring using a Quadratic Bezier curve
    const startPoint = new THREE.Vector3(0, 0, 0); // Start point
    const controlPoint = new THREE.Vector3(1, 0.1, 0.5); // Control point to shape the curve
    const endPoint = new THREE.Vector3(1, 0.2, 0); // End point
    const curve = new THREE.QuadraticBezierCurve3(startPoint, controlPoint, endPoint);
    const points = curve.getPoints(100); // Generate points along the curve

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const springMesh = new THREE.Line(geometry, material);

    const controlPoint2 = new THREE.Vector3(1, 0.3, -0.5); // Control point to shape the curve
    const endPoint2 = new THREE.Vector3(0, 0.4, 0); // End point
    const curve2 = new THREE.QuadraticBezierCurve3(endPoint, controlPoint2, endPoint2);
    const points2 = curve2.getPoints(100); // Generate points along the curve

    const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
    const springPartGroup = new THREE.Group();
    const springMesh2 = new THREE.Line(geometry2, material);

    springPartGroup.add(springMesh);
    springPartGroup.add(springMesh2);


    return springPartGroup;
  }

  buildSpring() {
    this.springGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const spring = this.buildSpringPart(); // Call your buildSpring() method here
      spring.position.set(2, 0.4*i, 0); // Adjust the x-coordinate as needed
      this.springGroup.add(spring); // Add the spring to the array
    }
  }


  init() {
    this.buildSpring();
  }

  setEnabled(enabled) {
    this.spring.visible = enabled;
  }
}

export { MySpring };

