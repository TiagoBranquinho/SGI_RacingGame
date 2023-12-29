import * as THREE from 'three';
import { MyObstacles } from './MyObstacles.js';
import { MyPowerups } from './MyPowerups.js';
import { MyParkedCars } from './MyParkedCars.js';
import { MyCheckpoint } from './MyCheckpoint.js';

class MyTrack {

    constructor(app, player, bot) {
        this.app = app;
        this.player = player;
        this.bot = bot;
        this.obstacleHandler = new MyObstacles(app);
        this.powerupHandler = new MyPowerups(app);
        this.parkedCarHandler = new MyParkedCars(app);
        //Curve related attributes
        this.segments = 200;
        this.width = 8;
        this.textureRepeat = 1;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = true;
        this.closedCurve = false;
        this.enableCollisions = false;
        this.canPlaceObstacle = true;
        this.listenerEnabled = false;
        this.pickObstacles = false;


        setTimeout(() => {
            this.enableCollisions = true;
        }, 1000);

        setTimeout(() => {
            this.parkedCarHandler.gato();
        }, 1000);



        this.path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-120, 0, 0),
            new THREE.Vector3(-140, 0, -40),
            new THREE.Vector3(-120, 0, -80),
            new THREE.Vector3(-200, 0, -120),
            new THREE.Vector3(-240, 0, -110),
            new THREE.Vector3(-120, 0, 40),
            new THREE.Vector3(100, 0, 50),
            new THREE.Vector3(110, 0, 150),
            new THREE.Vector3(90, 0, 200),
            new THREE.Vector3(85, 0, 210),
            new THREE.Vector3(95, 0, 230),
            new THREE.Vector3(120, 0, 230),
            new THREE.Vector3(160, 0, 220),
            new THREE.Vector3(150, 0, 0),
            new THREE.Vector3(0, 0, 0)
        ]);

        this.checkpoints = this.path.points.map(point => new MyCheckpoint(new THREE.Vector3(-point.x, point.y, point.z)));
        this.nextCheckpointIndex = 0;

        //animation parameters

        this.keyPoints = [
            new THREE.Vector3(0, 0.8, -3),
            new THREE.Vector3(120, 0.8, 0),
            new THREE.Vector3(140, 0.8, -40),
            new THREE.Vector3(120, 0.8, -80),
            new THREE.Vector3(200, 0.8, -120),
            new THREE.Vector3(240, 0.8, -110),
            new THREE.Vector3(120, 0.8, 40),
            new THREE.Vector3(-100, 0.8, 50),
            new THREE.Vector3(-110, 0.8, 150),
            new THREE.Vector3(-90, 0.8, 200),
            new THREE.Vector3(-85, 0.8, 210),
            new THREE.Vector3(-95, 0.8, 230),
            new THREE.Vector3(-120, 0.8, 230),
            new THREE.Vector3(-160, 0.8, 220),
            new THREE.Vector3(-150, 0.8, 0),
            new THREE.Vector3(-0, 0.8, -3)
        ];

        this.clock = new THREE.Clock()

        this.mixerTime = 0
        this.mixerPause = false

        this.enableAnimationPosition = true
        this.animationMaxDuration = 30 //seconds
    }

    /**
 * Creates the necessary elements for the curve
 */
    buildCurve() {
        this.createCurveMaterialsTextures();
        this.createCurveObjects();
    }

    /**
     * Create materials for the curve elements: the mesh, the line and the wireframe
     */
    createCurveMaterialsTextures() {
        const texture = new THREE.TextureLoader().load("t08g01/textures/road.jpg");
        texture.wrapS = THREE.RepeatWrapping;

        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.material.map.repeat.set(3, 3);
        this.material.map.wrapS = THREE.RepeatWrapping;
        this.material.map.wrapT = THREE.RepeatWrapping;

        this.wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            opacity: 0.3,
            wireframe: true,
            transparent: true,
        });

        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    }

    /**
     * Creates the mesh, the line and the wireframe used to visualize the curve
     */
    createCurveObjects() {
        let geometry = new THREE.TubeGeometry(
            this.path,
            this.segments,
            this.width,
            3,
            this.closedCurve
        );
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);

        let points = this.path.getPoints(this.segments);
        let bGeometry = new THREE.BufferGeometry().setFromPoints(points);

        // Create the final object to add to the scene
        this.line = new THREE.Line(bGeometry, this.lineMaterial);

        this.curve = new THREE.Group();

        this.mesh.visible = this.showMesh;
        this.wireframe.visible = this.showWireframe;
        this.line.visible = this.showLine;

        this.curve.add(this.mesh);
        this.curve.add(this.wireframe);
        this.curve.add(this.line);

        this.curve.rotateZ(Math.PI);
        this.curve.scale.set(1, 0.2, 1);
        this.app.scene.add(this.curve);
    }

    /**
     * Called when user changes number of segments in UI. Recreates the curve's objects accordingly.
     */
    updateCurve() {
        if (this.curve !== undefined && this.curve !== null) {
            this.app.scene.remove(this.curve);
        }
        this.buildCurve();
    }

    /**
     * Called when user curve's closed parameter in the UI. Recreates the curve's objects accordingly.
     */
    updateCurveClosing() {
        if (this.curve !== undefined && this.curve !== null) {
            this.app.scene.remove(this.curve);
        }
        this.buildCurve();
    }

    /**
     * Set a specific point in the animation clip
     */
    setMixerTime() {
        this.mixer.setTime(this.mixerTime)
    }


    /**
     * Build control points and a visual path for debug
     */
    debugKeyFrames() {

        this.spline = new THREE.CatmullRomCurve3([...this.keyPoints])

        // Setup visual control points

        for (let i = 0; i < this.keyPoints.length; i++) {
            const geometry = new THREE.SphereGeometry(1, 32, 32)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const sphere = new THREE.Mesh(geometry, material)
            sphere.scale.set(0.2, 0.2, 0.2)
            sphere.position.set(... this.keyPoints[i])

            this.app.scene.add(sphere)
        }

        const tubeGeometry = new THREE.TubeGeometry(this.spline, 100, 0.05, 10, false)
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)

        this.app.scene.add(tubeMesh)

    }

    /**
     * Start/Stop all animations
     */
    checkAnimationStateIsPause() {
        if (this.mixerPause)
            this.mixer.timeScale = 0
        else
            this.mixer.timeScale = 1
    }


    /**
     * Start/Stop if position or rotation animation track is running
     */
    checkTracksEnabled() {

        const actions = this.mixer._actions
        for (let i = 0; i < actions.length; i++) {
            const track = actions[i]._clip.tracks[0]

            if (track.name === '.position' && this.enableAnimationPosition === false) {
                actions[i].stop()
            }
            else {
                if (!actions[i].isRunning())
                    actions[i].play()
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update(paused) {
        // If the game is paused, return immediately
        if (paused) {
            this.mixerPause = true; // Pause the bot animation
            this.checkAnimationStateIsPause()
            this.enableListener();
        } else {
            this.player.handler.update();
            this.mixerPause = false; // Unpause the bot animation
            this.checkAnimationStateIsPause()
            this.removeListener();
        }

        this.checkTracksEnabled()

        const delta = this.clock.getDelta()
        this.mixer.update(delta)

        const tangent = this.spline.getTangentAt((this.mixer.time % this.animationMaxDuration) / this.animationMaxDuration)
        this.bot.model.rotation.y = Math.atan2(tangent.x, tangent.z)

        this.player.updateState(this.mixer.time)


        if (this.enableCollisions) {
            this.checkPlayerCollisions()
        }

        let checkpoint = this.checkpoints[this.nextCheckpointIndex];
        if (checkpoint.checkReached(this.player.model.position)) {
            console.log('Checkpoint reached!');
            // Do something when a checkpoint is reached

            // If this is the last checkpoint, increment the lap count and reset the next checkpoint index
            if (this.nextCheckpointIndex === this.checkpoints.length - 1) {
                this.player.lapCount++;
                console.log('Lap completed! Total laps:', this.player.lapCount);
                this.nextCheckpointIndex = 0;
                for (let i = 0; i < this.checkpoints.length; i++) {
                    this.checkpoints[i].reached = false;
                }
            } else {
                // Otherwise, move to the next checkpoint
                this.nextCheckpointIndex++;
            }
        }

        this.updateCamera();
    }

    checkPlayerCollisions() {
        this.checkObjectsCollisions()
        this.checkPowerupsCollisions()
        if (this.isOffTrack(this.player.model) || this.checkBotCollisions()) {
            this.player.setSlow(this.mixer.time);
        }
    }

    checkObjectsCollisions() {
        const playerObstacleCollisionType = this.obstacleHandler.checkCollision(this.player.model.position, this.player.radius)

        switch (playerObstacleCollisionType) {
            case 'cone':
                this.player.setSlow(this.mixer.time);
                break;
            case 'barrel':
                this.player.setDrunk(this.mixer.time);
                break;
            default:
                break;
        }
    }
    checkPowerupsCollisions() {
        const playerPowerUpCollisionType = this.powerupHandler.checkCollision(this.player.model.position, this.player.radius)

        switch (playerPowerUpCollisionType) {
            case 'speedRamp':
                this.player.setBoost(this.mixer.time);
                break;
            case 'clock':
                this.player.reduceTime(this.mixer.time);
                break;
            default:
                break;
        }
        if (this.canPlaceObstacle && (playerPowerUpCollisionType === 'clock' || playerPowerUpCollisionType === 'speedRamp')) {
            this.obstacleHandler.gato();
            this.canPlaceObstacle = false;
            this.pickObstacles = true;
            this.app.paused = !this.app.paused;
            this.enableListener();
        }
    }

    checkBotCollisions() {
        return this.player.model.position.distanceTo(this.bot.model.position) <= this.bot.radius + this.player.radius;
    }

    isOffTrack(obj) {
        const position = obj.position.clone();
        const raycaster = new THREE.Raycaster(position, new THREE.Vector3(0, -1, 0));

        // Check intersections with the track mesh
        const intersections = raycaster.intersectObject(this.curve, true);
        // If there are intersections, the player is on the track
        return intersections.length == 0;
    }

    updateCamera() {
        const cameraOffset = new THREE.Vector3(0, 3, -9);
        cameraOffset.applyEuler(this.player.model.rotation);
        if (!this.app.paused) {
            this.app.activeCamera.position.copy(this.player.model.position).add(cameraOffset);
            this.app.activeCamera.lookAt(this.player.model.position.clone());
            this.app.controls.target.copy(this.player.model.position.clone());
        }

        // Make the camera look at the car
        this.app.activeCamera.updateProjectionMatrix();
    }

    enableListener() {
        if (!this.listenerEnabled) {
            document.addEventListener("pointermove", this.boundPointerMove, false);
            document.addEventListener("pointerdown", this.boundPointerDown, false);
            document.addEventListener("pointerup", this.boundPointerUp, false);
            this.listenerEnabled = true;
        }

    }

    removeListener() {
        document.removeEventListener("pointermove", this.boundPointerMove, false);
        document.removeEventListener("pointerdown", this.boundPointerDown, false);
        document.removeEventListener("pointerup", this.boundPointerUp, false);
        this.listenerEnabled = false;
    }

    onPointerDown() {
        this.mousePressed = true; // Set the flag when the mouse is pressed~
        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);
        console.log(this.pickObstacles)
        var objects = this.pickObstacles ? this.obstacleHandler.getObjectsList().concat([this.curve]) : this.parkedCarHandler.getCarsList().concat([this.curve]);

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(objects);

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
        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);

        var objects = this.pickObstacles ? this.obstacleHandler.getObjectsList() : this.parkedCarHandler.getCarsList();

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(objects);

        this.pickingHelper(intersects)
    }

    pickingHelper(intersects) {
        if (intersects.length > 0) {
            let initObj = intersects[0].object;
            let model3dObj = null;
            while (initObj.parent) {
                if (initObj.type === "Object3D") {
                    model3dObj = initObj;
                }
                initObj = initObj.parent;
            }
            let obj = null;
            if (model3dObj) {
                obj = this.pickObstacles ? model3dObj.parent.parent : model3dObj.parent;
            }
            else {
                obj = intersects[0].object.parent.parent.type === "Group" ? intersects[0].object.parent.parent : intersects[0].object;
            }

            let pickingColor = new THREE.Color();
            pickingColor.setRGB(1, 0, 0);

            if (this.isOffTrack(obj)) {
                this.obstacleHandler.changeColor(obj, pickingColor);
            }

            if (this.mousePressed) {
                console.log(obj)
                if (this.obstacleHandler.getObjectsList().includes(obj)) {
                    if (!this.isOffTrack(obj)) {
                        return;
                    }
                    this.selectedObstacle = obj;
                    console.log("selected obstacle: " + this.selectedObstacle);
                }
                else if (this.parkedCarHandler.getCarsList().includes(obj)) {
                    if (!this.isOffTrack(obj)) {
                        return;
                    }
                    this.selectedCar = obj;
                    console.log("selected car: " + this.selectedCar);
                }

                else {

                    if (!this.isOffTrack(obj)) {
                        if (this.selectedObstacle !== null) {
                            this.pickObstacles = false;
                            this.selectedObstacle.position.copy(intersects[0].point);
                            this.obstacleHandler.restoreColor(this.selectedObstacle);
                            this.obstacleHandler.update();
                            this.selectedObstacle = null;
                            this.app.paused = !this.app.paused;
                        }
                    }
                }
            }

        } else {
            this.restoreColorOfFirstPickedObj();
        }
    }

    restoreColorOfFirstPickedObj() {
            let cars = this.parkedCarHandler.getCarsList();
            for (var i = 0; i < cars.length; i++) {
                let car = cars[i];
                if (car !== this.selectedCar) {
                    this.parkedCarHandler.restoreColor(car);
                }
            }
        
            let obstacles = this.obstacleHandler.getObjectsList();
            for (var i = 0; i < obstacles.length; i++) {
                let obstacle = obstacles[i];
                if (obstacle !== this.selectedObstacle) {
                    this.obstacleHandler.restoreColor(obstacle);
                }
            }

    }



    init() {

        this.boundPointerMove = this.onPointerMove.bind(this);
        this.boundPointerDown = this.onPointerDown.bind(this);
        this.boundPointerUp = this.onPointerUp.bind(this);


        this.pointer = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 0.1
        this.raycaster.far = 100
        this.selectedObstacle = null
        this.selectedCar = null


        this.buildCurve();
        this.bot.draw();
        this.player.draw();

        //visual debuging the path and the controls points
        this.debugKeyFrames()

        // Assuming `duration` is the total duration of the animation
        let duration = this.animationMaxDuration; // specify the duration

        let distances = [0];
        for (let i = 1; i < this.spline.points.length; i++) {
            let segmentLength = this.spline.points[i].distanceTo(this.spline.points[i - 1]);
            distances.push(distances[i - 1] + segmentLength);
        }

        let totalDistance = distances[distances.length - 1];

        let times = distances.map(distance => (distance / totalDistance) * duration);


        const positionKF = new THREE.VectorKeyframeTrack('.position', times,
            [
                ...this.keyPoints[0],
                ...this.keyPoints[1],
                ...this.keyPoints[2],
                ...this.keyPoints[3],
                ...this.keyPoints[4],
                ...this.keyPoints[5],
                ...this.keyPoints[6],
                ...this.keyPoints[7],
                ...this.keyPoints[8],
                ...this.keyPoints[9],
                ...this.keyPoints[10],
                ...this.keyPoints[11],
                ...this.keyPoints[12],
                ...this.keyPoints[13],
                ...this.keyPoints[14],
                ...this.keyPoints[15]
            ],
            THREE.InterpolateSmooth  /* THREE.InterpolateLinear (default), THREE.InterpolateDiscrete,*/
        )

        const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF])

        // Create an AnimationMixer
        this.mixer = new THREE.AnimationMixer(this.bot.model)

        // Create AnimationActions for each clip
        const positionAction = this.mixer.clipAction(positionClip)

        // Play both animations
        positionAction.play()

    }


}

export { MyTrack };
