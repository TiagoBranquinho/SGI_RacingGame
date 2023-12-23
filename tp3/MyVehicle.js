import * as THREE from 'three';
import { MyVehicleHandler } from './MyVehicleHandler.js';

class MyVehicle {

    constructor(app, model, isPlayer = false) {
        this.app = app;
        this.model = model;
        this.radius = 3;
        this.collisionsTime = 3000;
        this.info = document.getElementById('player-status');
        this.isNormal = true;
        this.state = {"drunk": false, "slow": false};
        if (isPlayer === true) {
            this.handler = new MyVehicleHandler(this.app, this);
        }
        this.init();

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

    setDrunk() {
        this.drunkTime = Date.now();
        this.handler.drunk = -1;
        this.updateInfo("Drunk\n");
    }

    setSlow() {
        this.slowTime = Date.now();
        this.handler.slow = true;
        this.updateInfo("Slow\n");
    }

    setNormal() {
        this.handler.drunk = 1;
        this.handler.slow = false;
        this.updateInfo("");
    }

    updateState() {
        if (this.handler.slow && Date.now() - this.slowTime > this.collisionsTime) {
            this.setNormal();
        }
        if (this.handler.drunk === -1 && Date.now() - this.drunkTime > this.collisionsTime) {
            this.setNormal();
        }
    }

    updateInfo(state) {
        if(state === "normal"){
            for(let key in this.state){
                this.state[key] = false;
            }
        }
        else{
            this.state[state] = true;
        }
    }

}

export { MyVehicle };
