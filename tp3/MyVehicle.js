import * as THREE from 'three';
import { MyVehicleHandler } from './MyVehicleHandler.js';

class MyVehicle {

    constructor(app, model, difficulty = 0, name = "Player") {
        this.app = app;
        this.model = model;
        this.radius = difficulty === 0 ? 2.7 : 0.1;
        this.collisionsTime = 2;
        this.isNormal = true;
        this.time = 0;
        this.lastTimeReduction = 0;
        this.timeReductionInterval = 5; // Set this to the desired interval in seconds
        this.state = { "drunk": false, "slow": false, "boost": false };
        this.currentTime = 0;
        this.timers = { "drunk": 0, "slow": 0, "boost": 0 };
        if (difficulty === 0) {
            this.name = name
            this.handler = new MyVehicleHandler(this);
            this.lapCount = 0;
            this.name = name;
        }
        else {
            this.name = "Bot";
            this.difficulty = difficulty;
        }
        this.init();

    }
    init() {
        let scale;
        if (this.model.name.split('/')[2] === 'car2.glb') {
            scale = 0.01;
            this.model.rotation.y = Math.PI / 2;
            this.model.position.set(0, 0.9, 0);
        }
        else {
            scale = 0.7;
            this.model.rotation.y = Math.PI / 2;
            this.model.position.set(0, 1.4, 0);
        }
        this.model.scale.set(scale, scale, scale);
        this.model.rotation.x = 0;
    }
    draw() {
        this.app.scene.add(this.model);
    }

    setDrunk(time) {
        this.drunkTime = time;
        this.handler.drunk = -1;
        this.state.drunk = true;
    }

    removeDrunk() {
        this.handler.drunk = 1;
        this.state.drunk = false;
    }

    setSlow(time) {
        this.slowTime = time;
        this.handler.slow = 0.6;
        this.state.slow = true;
    }

    removeSlow() {
        this.handler.slow = 1;
        this.state.slow = false;
    }

    setBoost(time) {
        this.boostTime = time;
        this.handler.boost = 2;
        this.state.boost = true;
    }

    removeBoost() {
        this.handler.boost = 1;
        this.state.boost = false;
    }

    updateState(time) {
        if (this.handler.slow === 0.6 && time - this.slowTime > this.collisionsTime) {
            this.removeSlow();
        }
        if (this.handler.drunk === -1 && time - this.drunkTime > this.collisionsTime) {
            this.removeDrunk();
        }
        if (this.handler.boost === 2 && time - this.boostTime > this.collisionsTime) {
            this.removeBoost();
        }
        this.updateTimers(time);
    }

    updateTimers(time) {
        this.currentTime = Math.floor(time - this.time);
        this.timers.boost = parseFloat((this.collisionsTime + this.boostTime - time).toFixed(1));
        this.timers.drunk = parseFloat((this.collisionsTime + this.drunkTime - time).toFixed(1));
        this.timers.slow = parseFloat((this.collisionsTime + this.slowTime - time).toFixed(1));
    }

    reduceTime(time) {
        if (time - this.lastTimeReduction >= this.timeReductionInterval) {
            this.time += 2;
            this.lastTimeReduction = time;
        }
    }

}

export { MyVehicle };
