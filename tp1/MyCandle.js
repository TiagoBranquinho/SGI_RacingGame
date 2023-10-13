import * as THREE from 'three';


class MyCandle {

  constructor(app) {
    this.app = app;
    this.candleGroup = null;
    this.candleSize = 1;
    this.lastCandleEnabled = null;
    this.candleDisplacement = new THREE.Vector3(0, 0, 0);
  }

  buildCandle() {
    let candleHeight = 0.8;
    let candleRadius = 0.10;

    let candleMaterial = new THREE.MeshPhongMaterial({
      color: "#FFD700",
      specular: "#FFD700",
      emissive: "#000000",
      shininess: 90
    });

    let flameMaterial = new THREE.MeshPhongMaterial({
      color: "#FF4500",
      specular: "#FF4500",
      emissive: "#FF4500",
      shininess: 90
    });


    let candleGeometry = new THREE.CylinderGeometry(candleRadius, candleRadius, candleHeight, 32);
    candleGeometry.translate(0, candleHeight, 0);
    let candle = new THREE.Mesh(candleGeometry, candleMaterial);


    let flameGeometry = new THREE.ConeGeometry(candleRadius * 1.1, candleRadius * 1.5, 32);
    let flame = new THREE.Mesh(flameGeometry, flameMaterial);

    flame.position.set(0, candleHeight * 1.6, 0);

    this.candleGroup = new THREE.Group();

    this.candleGroup.add(candle);
    this.candleGroup.add(flame);



    this.candleGroup.scale.set(this.candleSize, this.candleSize, this.candleSize);
  }

  init() {
    this.buildCandle();
  }

  setEnabled(enabled) {
    this.candleGroup.visible = enabled;
  }
}

export { MyCandle };
