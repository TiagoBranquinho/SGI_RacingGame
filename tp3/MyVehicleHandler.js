import * as THREE from 'three';

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
        this.normalSpeed = 0.6;
        this.slow = 1;
        this.drunk = 1;
        this.boost = 1;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = 0.14;  // Adjust the acceleration factor
        this.deceleration = 0.1;  // Adjust the deceleration factor
        this.braking = 0.15;  // Adjust the braking factor
        this.maxRotationSpeed = 1.7;
        this.direction = new THREE.Vector3(0, 0, 1);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.update = this.update.bind(this);

        

        this.initEventListeners();

        // Start the game loop
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
        let speed = this.normalSpeed * this.boost * this.slow;

        // Create a direction vector based on the vehicle's current rotation
        this.direction.set(0, 0, 1);
        this.rotationSpeed = this.velocity.length() * 5.4;
        if (this.rotationSpeed > this.maxRotationSpeed) {
            this.rotationSpeed = this.maxRotationSpeed;
        }
        console.log(this.rotationSpeed);
        this.direction.applyEuler(this.vehicle.model.rotation);
        if (this.keyStates['KeyW']) {
            // Accelerate the vehicle
            this.velocity.add(this.direction.clone().multiplyScalar(this.acceleration * deltaTime));
            /* for(let wheelNumber = 2; wheelNumber < 3; wheelNumber++){
                this.vehicle.model.children[0].children[wheelNumber].rotation.x += this.rotationSpeed;
                console.log(this.vehicle.model.children[0].children[wheelNumber])
            } */
        } else if (this.velocity.length() > 0) {
            // Decelerate the vehicle when 'W' is not pressed
            this.velocity.add(this.velocity.clone().normalize().negate().multiplyScalar(this.deceleration * deltaTime));
        }

        if (this.keyStates['KeyA']) {
            // Rotate the vehicle to the left
            this.vehicle.model.rotation.y += (this.rotationSpeed * this.drunk * deltaTime);
        }

        if (this.keyStates['KeyS']) {
            // Decelerate the vehicle when 'S' is pressed
            this.velocity.add(this.velocity.clone().normalize().negate().multiplyScalar(this.braking * deltaTime));
        }

        if (this.keyStates['KeyD']) {
            // Rotate the vehicle to the right
            this.vehicle.model.rotation.y -= (this.rotationSpeed * this.drunk * deltaTime);
        }


        // Ensure the y-component of the velocity remains zero
        this.velocity.y = 0;

        // Limit the velocity to the maximum speed
        if (this.velocity.length() > speed) {
            this.velocity = this.velocity.normalize().multiplyScalar(speed);
        }

        // Update the direction based on the vehicle's rotation
        this.direction.set(0, 0, 1);
        this.direction.applyEuler(this.vehicle.model.rotation);

        // Update the velocity based on the direction
        this.velocity = this.direction.clone().multiplyScalar(this.velocity.length());

        // Update car position so it only moves in the direction it's facing
        this.vehicle.model.position.add(this.velocity);

    }

}

export { MyVehicleHandler };
