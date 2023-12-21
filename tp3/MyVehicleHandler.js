import * as THREE from 'three';

class MyVehicleHandler {
    constructor(app, vehicle) {
        this.vehicle = vehicle;
        console.log(this.vehicle);
        this.app = app;
        this.init();
        this.keyStates = {
            "KeyW": false,
            "KeyA": false,
            "KeyS": false,
            "KeyD": false,
            "Space": false,
        };
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = 0.0007;  // Adjust the acceleration factor
        this.deceleration = 0.0004;  // Adjust the deceleration factor
        this.braking = 0.0007;  // Adjust the braking factor
        this.maxRotationSpeed = 0.010;
        this.direction = new THREE.Vector3(0, 0, 1);
        this.lockCamera = true;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.update = this.update.bind(this);
        this.initEventListeners();

        // Start the game loop
        this.gameLoop();
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

    update() {
        if (this.keyStates['Space']) {
            console.log("gato")
            this.lockCamera = !this.lockCamera;
        }
        const speed = 0.5;
        // Create a direction vector based on the vehicle's current rotation
        this.direction.set(0, 0, 1);
        this.rotationSpeed = this.velocity.length() * 0.05;
        if (this.rotationSpeed > this.maxRotationSpeed) {
            this.rotationSpeed = this.maxRotationSpeed;
        }
        this.direction.applyEuler(this.vehicle.model.rotation);
        if (this.keyStates['KeyW']) {
            // Accelerate the vehicle
            this.velocity.add(this.direction.clone().multiplyScalar(this.acceleration));
            /* for(let wheelNumber = 2; wheelNumber < 3; wheelNumber++){
                this.vehicle.model.children[0].children[wheelNumber].rotation.x += this.rotationSpeed;
                console.log(this.vehicle.model.children[0].children[wheelNumber])
            } */
        } else if (this.velocity.length() > 0) {
            // Decelerate the vehicle when 'W' is not pressed
            this.velocity.add(this.velocity.clone().normalize().negate().multiplyScalar(this.deceleration));
        }

        if (this.keyStates['KeyA']) {
            // Rotate the vehicle to the left
            this.vehicle.model.rotation.y += this.rotationSpeed;
        }

        if (this.keyStates['KeyS']) {
            // Decelerate the vehicle when 'S' is pressed
            this.velocity.add(this.velocity.clone().normalize().negate().multiplyScalar(this.braking));
        }

        if (this.keyStates['KeyD']) {
            // Rotate the vehicle to the right
            this.vehicle.model.rotation.y -= this.rotationSpeed;
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

        const cameraOffset = new THREE.Vector3(0, 5, -20);
        cameraOffset.applyEuler(this.vehicle.model.rotation);
        if (this.lockCamera) {
            this.app.activeCamera.position.copy(this.vehicle.model.position).add(cameraOffset);
        }

        // Update the camera's internal matrix
        this.app.activeCamera.lookAt(this.vehicle.model.position.clone());
        this.app.controls.target.copy(this.vehicle.model.position.clone());

        // Make the camera look at the car
        this.app.activeCamera.updateProjectionMatrix();

    }

    gameLoop() {
        // Call the update method and request the next frame
        this.update();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

export { MyVehicleHandler };
