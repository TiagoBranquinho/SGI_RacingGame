import * as THREE from 'three';
import { MyVehicleHandler } from './MyVehicleHandler.js';

class MyVehicle {

    constructor(app, model, isPlayer = false) {
        this.app = app;
        this.model = model;
        isPlayer ? this.radius = 3 : 3;
        this.collisionsTime = 3000;
        this.info = document.getElementById('player-status');
        this.isNormal = true;
        this.state = {"drunk": false, "slow": false, "boost" : false};
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
        this.state.drunk = true;
    }

    removeDrunk() {
        this.handler.drunk = 1;
        this.state.drunk = false;
    }

    setSlow() {
        this.slowTime = Date.now();
        this.handler.slow = 0.4;
        this.state.slow = true;
    }

    removeSlow() {
        this.handler.slow = 1;
        this.state.slow = false;
    }

    setBoost() {
        this.boostTime = Date.now();
        this.handler.boost = 2;
        this.state.boost = true;
    }

    removeBoost() {
        this.handler.boost = 1;
        this.state.boost = false;
    }

    updateState() {
        if (this.handler.slow === 0.4 && Date.now() - this.slowTime > this.collisionsTime) {
            this.removeSlow();
        }
        if (this.handler.drunk === -1 && Date.now() - this.drunkTime > this.collisionsTime) {
            this.removeDrunk();
        }
        if (this.handler.boost === 2 && Date.now() - this.boostTime > this.collisionsTime) {
            this.removeBoost();
        }
        this.updateInfo();
    }

    updateInfo() {
        let info = "";
        for(let key in this.state){
            if(this.state[key]){
                info += key + "\n";
            }
        }
        this.info.innerText = info;
    }

}

export { MyVehicle };
