import * as THREE from 'three';
import { MyVehicleHandler } from './MyVehicleHandler.js';

class MyVehicle {

    constructor(app, model, isPlayer = false) {
        this.app = app;
        this.model = model;
        this.radius = 3;
        this.init();
        if (isPlayer === true) {
            this.handler = new MyVehicleHandler(this.app, this);
        }
    }
    init() {
        let scale;
        console.log(this.model.name.split('/'));
        if (this.model.name.split('/')[2] === 'car2.glb') {
            scale = 0.01;
        }
        else {
            scale = 3;
        }
        this.model.scale.set(scale, scale, scale);
        this.model.position.set(0, 0.9, 0);
        this.model.rotation.x = 0;
        this.model.rotation.y = Math.PI / 2;
    }
    draw() {
        this.app.scene.add(this.model);
    }

}

export { MyVehicle };
