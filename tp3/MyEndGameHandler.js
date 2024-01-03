import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

class MyEndGameHandler {
    constructor(contents, restartButton, backToMenuButton) {
        this.contents = contents;
        this.restartButton = restartButton;
        this.backToMenuButton = backToMenuButton;
        this.selectedButton = null;
        this.init();
        this.moveListener();
        this.mousePressed = false;
    }
    init() {
        this.pointer = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 0.1
        this.raycaster.far = 300
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
        var intersectsRestart = this.raycaster.intersectObjects(this.restartButton);

        this.pickingHelper(intersectsRestart)

        var intersectsBackToMenu = this.raycaster.intersectObjects(this.backToMenuButton);

        this.pickingHelper(intersectsBackToMenu)
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

        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.contents.app.activeCamera);

        var allButtons = this.restartButton.concat(this.backToMenuButton);
        // Compute intersections
        var intersects = this.raycaster.intersectObjects(allButtons);

        // Call pickingHelper once
        this.pickingHelper(intersects);
    }


    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            let pickingColor = 0x0000ff;

            obj.material.color.setHex(pickingColor);

            // Track the selected car when the mouse is pressed
            if (this.mousePressed) {
                if (obj.restart) {
                    this.selectedButton = obj;
                    this.contents.track.removeListener();
                    this.removeListener();
                    this.contents.track.removeListener();
                    this.contents.setFireworks = false;
                    this.contents.restartGame(this.contents.car, this.contents.car2, this.contents.difficulty, this.contents.name);
                }
                else if (obj.backToMenu) {
                    this.selectedButton = obj;
                    this.contents.track.removeListener();
                    this.removeListener();
                    this.contents.setFireworks = false;
                    this.contents.restartMenu();                    
                }
            }

        } else {
            this.restoreColorOfFirstPickedObj();
        }
    }

    restoreColorOfFirstPickedObj() {
        for (var i = 0; i < this.restartButton.length; i++) {
            let button = this.restartButton[i];
            if (button != this.selectedButton) {
                button.material.color.setHex(0x0088ff);
            }
        }
        for (var i = 0; i < this.backToMenuButton.length; i++) {
            let button = this.backToMenuButton[i];
            if (button != this.selectedButton) {
                button.material.color.setHex(0x0088ff);
            }
        }
    }

    transverseRaycastProperties(intersects) {
        for (var i = 0; i < intersects.length; i++) {

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
}
export { MyEndGameHandler };
