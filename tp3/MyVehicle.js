import * as THREE from 'three';
import { MyVehicleHandler } from './MyVehicleHandler.js';

class MyVehicle {

    constructor(app, model) {
        this.app = app;
        this.model = model;
        this.velocity = 0;
        this.handler = new MyVehicleHandler(this.app, this);
        this.init();
    }
    init() {
        this.model.scale.set(0.01, 0.01, 0.01);
        this.model.position.set(0, 0.8, 0);
        this.model.rotation.x = 0;
    }
    draw() {
        this.app.scene.add(this.model);
    }

}

export { MyVehicle };
