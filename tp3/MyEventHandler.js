import * as THREE from 'three';

class MyEventHandler {
    constructor(contents, intersectObjects, rotatableObjects) {
        this.contents = contents;
        this.intersectObjects = intersectObjects;
        this.rotatableObjects = rotatableObjects;
        this.init();
        this.moveListener();
        this.mousePressed = false;
        this.selectedCar = null; // Track the selected car
    }
    init() {
        this.pointer = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 0.1
        this.raycaster.far = 100
        this.pickingColor = 0x00ff00
    }
    moveListener() {
        this.boundPointerMove = this.onPointerMove.bind(this);
        this.boundPointerDown = this.onPointerDown.bind(this);
        this.boundPointerUp = this.onPointerUp.bind(this);

        document.addEventListener("pointermove", this.boundPointerMove, false);
        document.addEventListener("pointerdown", this.boundPointerDown, false);
        document.addEventListener("pointerup", this.boundPointerUp, false);
    }

    removeListener() {
        document.removeEventListener("pointermove", this.boundPointerMove, false);
        document.removeEventListener("pointerdown", this.boundPointerDown, false);
        document.removeEventListener("pointerup", this.boundPointerUp, false);
    }
    onPointerDown() {
        this.mousePressed = true; // Set the flag when the mouse is pressed~
        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.contents.app.activeCamera);

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(this.intersectObjects);

        this.pickingHelper(intersects)
    }

    onPointerUp() {
        this.mousePressed = false; // Clear the flag when the mouse is released

    }

    onPointerMove(event) {

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.contents.app.activeCamera);

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(this.intersectObjects);

        if (this.mousePressed) {
            this.rotateSquares(event);
        }

        this.pickingHelper(intersects)

        //this.transverseRaycastProperties(intersects)
    }


    pickingHelper(intersects) {
        if (intersects.length > 0) {
            //console.log(intersects)
            const obj = intersects[0].object;
            obj.material.color.setHex(this.pickingColor);

            // Track the selected car when the mouse is pressed
            if (this.mousePressed) {
                if (obj.launchGame) {
                    if (this.selectedCar != null) {
                        this.removeListener();
                        this.contents.startGame();
                    }
                }
                else {
                    this.selectedCar = obj;
                    console.log("selected car: " + this.selectedCar);
                }

            }

        } else {
            this.restoreColorOfFirstPickedObj();
        }
    }



    restoreColorOfFirstPickedObj() {
        for (var i = 0; i < this.intersectObjects.length; i++) {
            let car = this.intersectObjects[i];
            if (car != this.selectedCar) {
                car.material.color.setHex(0x0088ff);
            }
        }
    }

    transverseRaycastProperties(intersects) {
        for (var i = 0; i < intersects.length; i++) {

            //console.log(intersects[i]);

            /*
            An intersection has the following properties :
                - object : intersected object (THREE.Mesh)
                - distance : distance from camera to intersection (number)
                - face : intersected face (THREE.Face3)
                - faceIndex : intersected face index (number)
                - point : intersection point (THREE.Vector3)
                - uv : intersection point in the object's UV coordinates (THREE.Vector2)
            */
        }
    }

    rotateSquares(event) {
        // Calculate rotation amounts based on mouse movement
        const rotationSpeed = 0.005;
        const deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;

        // Apply rotation to the object in both X and Y directions
        for (var i = 0; i < this.rotatableObjects.length; i++) {
            this.rotatableObjects[i].rotation.y += deltaX * rotationSpeed;
        }
    }


}
export { MyEventHandler };
