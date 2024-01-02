import * as THREE from 'three'
class MyVehicleHandler {
    constructor(vehicle) {
        this.vehicle = vehicle;
        this.init();
        this.keyStates = {
            "KeyW": false,
            "KeyA": false,
            "KeyS": false,
            "KeyD": false,
        };
        this.normalSpeed = 0.06;
        this.slow = 1;
        this.drunk = 1;
        this.boost = 1;
        this.velocity = 0;
        this.acceleration = 0.000015;  // Adjust the acceleration factor
        this.deceleration = 0.00001;  // Adjust the deceleration factor
        this.braking = 0.000018;  // Adjust the braking factor
        this.reverseAcceleration = 0.00001;  // Adjust the reverse acceleration factor
        this.maxRotationSpeed = 0.00145;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown, false);
        document.addEventListener('keyup', this.handleKeyUp, false);
    }

    init() {
        // Additional initialization for the vehicle handler if needed
    }

    handleKeyDown(event) {
        this.keyStates[event.code] = true;
    }

    handleKeyUp(event) {
        this.keyStates[event.code] = false;
    }

    update(deltaTime) {
        for (let i = 2; i < this.vehicle.model.children[0].children.length - 3; i++) {//rotate each wheel
            this.vehicle.model.children[0].children[i].rotation.y = 0;
        }

        let speed = this.normalSpeed * this.boost * this.slow;

        this.rotationSpeed = this.velocity * 0.046;
        if (this.rotationSpeed > this.maxRotationSpeed) {
            this.rotationSpeed = this.maxRotationSpeed;
        }

        // Update acceleration based on input
        if (this.keyStates['KeyW']) {
            this.velocity += this.acceleration * deltaTime;
        } else if (this.velocity > 0) {
            this.velocity -= this.deceleration * deltaTime;
        }




        // Update rotation based on input
        if (this.keyStates['KeyA']) {
            this.vehicle.model.rotation.y += this.rotationSpeed * this.drunk * deltaTime;
        }

        if (this.keyStates['KeyD']) {
            this.vehicle.model.rotation.y -= this.rotationSpeed * this.drunk * deltaTime;
        }

        // Update braking
        if (this.keyStates['KeyS']) {
            if (this.velocity > 0) {
                this.velocity -= this.braking * deltaTime;
            } else if (this.velocity <= 0) {
                this.velocity -= this.reverseAcceleration * deltaTime;
            }
        } else if (this.velocity < 0) {
            this.velocity += this.deceleration * deltaTime;
        }

        // Ensure velocity is within limits
        this.velocity = Math.min(this.velocity, speed);

        // Update car position
        let xMovement = this.velocity * Math.sin(this.vehicle.model.rotation.y);
        let zMovement = this.velocity * Math.cos(this.vehicle.model.rotation.y);
        this.vehicle.model.position.x += xMovement * deltaTime;
        this.vehicle.model.position.z += zMovement * deltaTime;

        for (let i = 2; i < this.vehicle.model.children[0].children.length; i++) {//rotate each wheel
            this.vehicle.model.children[0].children[i].rotation.order = 'ZYX';
            this.vehicle.model.children[0].children[i].rotation.x += this.velocity * deltaTime;
        }

        if (this.keyStates['KeyD']) {
            for (let i = 2; i < this.vehicle.model.children[0].children.length - 3; i++) {//rotate each wheel
                this.vehicle.model.children[0].children[i].rotation.y = - Math.PI / 6;
            }
        }
        if (this.keyStates['KeyA']) {
            for (let i = 2; i < this.vehicle.model.children[0].children.length - 3; i++) {//rotate each wheel
                this.vehicle.model.children[0].children[i].rotation.y = Math.PI / 6;
            }
        }
    }
}

export { MyVehicleHandler };
