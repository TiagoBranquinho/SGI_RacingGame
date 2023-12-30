import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

class MyMenuHandler {
    constructor(contents, playerCars, botCars, botDifficulty, rotatableObjects) {
        this.contents = contents;
        this.playerCars = playerCars;
        this.botCars = botCars;
        this.botDifficulty = botDifficulty;
        this.rotatableObjects = rotatableObjects;
        this.init();
        this.moveListener();
        this.mousePressed = false;
        this.selectedPlayerCar = null; // Track the selected car
        this.selectedBotCar = null; // Track the selected car
        this.selectedBotDifficulty = null;
        this.playerName = "name";
    }
    init() {
        this.pointer = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 0.1
        this.raycaster.far = 100
        this.pickingColorPlayer = 0x00ff00
        this.pickingColorBot = 0xff0000
        this.pickingColorBotDifficulty = 0xdedede
        this.pickingColorStart = 0x0000ff
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


    nameListener() {
        this.gato = this.input.bind(this);
        document.addEventListener("keydown", this.gato, false);
    }

    removeListenerName() {
        document.removeEventListener("keydown", this.gato, false);
    }

    input(event) {
        console.log(event);
        if (event.key === "Enter") {
            this.removeListenerName();
            if(this.contents.data !== null) {
                this.contents.restartGame(this.selectedPlayerCar.parent.parent.children[0], this.selectedBotCar.parent.parent.children[0], this.selectedBotDifficulty.difficulty, this.playerName);
            }
            else{
                this.contents.startGame(this.selectedPlayerCar.parent.parent.children[0], this.selectedBotCar.parent.parent.children[0], this.selectedBotDifficulty.difficulty, this.playerName);
            }
            return;
        }
        else if (event.key === "Backspace") {
            this.playerName = this.playerName.slice(0, -1);
        }
        else {
            this.playerName += event.key;
        }
        this.updateName();
    }


    updateName() {
        this.contents.app.scene.remove(this.contents.app.scene.children[3]);
        this.initName();

    }
    initName() {
        // Create a material for the background rectangle
        this.nameGroup = new THREE.Group();
        const backgroundMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.9, transparent: true });

        // Create a material for the text
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

        // Create a font loader
        const fontLoader = new FontLoader();

        // Load a font (you can replace 'helvetiker_regular.typeface.json' with your desired font)
        fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {

            // Create a background rectangle
            const backgroundGeometry = new THREE.PlaneGeometry(40, 10); // Adjust the size as needed
            this.backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
            this.backgroundMesh.position.set(0, 0, 4); // Adjust the position as needed
            this.nameGroup.add(this.backgroundMesh);
            // Create a TextGeometry for the input
            const textGeometry = new TextGeometry(this.playerName, {
                font: font,
                size: 0.9,
                height: 0.1,
                curveSegments: 12
            });

            // Create a mesh for the text
            this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
            this.textMesh.position.set(-5, 0, 4); // Center the text in the rectangle
            this.nameGroup.add(this.textMesh);
            this.contents.app.scene.add(this.nameGroup);
        });
    }

    onPointerDown() {
        console.log(this.playerCars);
        this.mousePressed = true; // Set the flag when the mouse is pressed~
        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.contents.app.activeCamera);
        console.log()

        //3. compute intersections
        var intersectsCar = this.raycaster.intersectObjects(this.playerCars);

        console.log(intersectsCar);

        this.pickingHelper(intersectsCar)

        var intersectsBot = this.raycaster.intersectObjects(this.botCars);

        this.pickingHelper(intersectsBot)

        var intersectsBotDifficulty = this.raycaster.intersectObjects(this.botDifficulty);

        this.pickingHelper(intersectsBotDifficulty)
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

        var allCars = this.playerCars.concat(this.botCars).concat(this.botDifficulty);
        // Compute intersections
        var intersects = this.raycaster.intersectObjects(allCars);

        if (this.mousePressed && intersects.length === 0) {
            this.rotateSquares(event);
        }

        // Call pickingHelper once
        this.pickingHelper(intersects);
    }


    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            let pickingColor;
            if (this.playerCars.includes(obj) && !obj.launchGame) {
                pickingColor = this.pickingColorPlayer;
            }
            else if (this.botCars.includes(obj)) {
                pickingColor = this.pickingColorBot;
            }
            else if (this.botDifficulty.includes(obj)) {
                pickingColor = this.pickingColorBotDifficulty;
            }
            else {
                pickingColor = this.pickingColorStart;
            }

            obj.material.color.setHex(pickingColor);

            // Track the selected car when the mouse is pressed
            if (this.mousePressed) {
                if (obj.launchGame) {
                    if (this.selectedPlayerCar !== null && this.selectedBotCar !== null && this.selectedBotDifficulty !== null) {
                        this.removeListener();
                        //this.contents.startGame(this.selectedPlayerCar.parent.parent.children[0], this.selectedBotCar.parent.parent.children[0], this.selectedBotDifficulty.difficulty);
                        this.nameListener();
                        this.initName();
                    }
                    else {
                        alert("Please select a car first!");
                        this.onPointerUp();
                    }
                }
                else {
                    if (this.playerCars.includes(obj)) {
                        this.selectedPlayerCar = obj;
                        console.log("selected player car: " + this.selectedPlayerCar);
                    }
                    else if (this.botCars.includes(obj)) {
                        this.selectedBotCar = obj;
                        console.log("selected bot car: " + this.selectedBotCar);
                    }
                    else if (this.botDifficulty.includes(obj)) {
                        this.selectedBotDifficulty = obj;
                        console.log("selected bot difficulty: " + this.selectedBotDifficulty);
                    }
                }

            }

        } else {
            this.restoreColorOfFirstPickedObj();
        }
    }



    restoreColorOfFirstPickedObj() {
        for (var i = 0; i < this.playerCars.length; i++) {
            let car = this.playerCars[i];
            if (car != this.selectedPlayerCar) {
                car.material.color.setHex(0x0088ff);
            }
        }
        for (var i = 0; i < this.botCars.length; i++) {
            let car = this.botCars[i];
            if (car != this.selectedBotCar) {
                car.material.color.setHex(0x0088ff);
            }
        }
        for (var i = 0; i < this.botDifficulty.length; i++) {
            let difficulty = this.botDifficulty[i];
            if (difficulty != this.selectedBotDifficulty) {
                difficulty.material.color.setHex(0x0088ff);
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
export { MyMenuHandler };
