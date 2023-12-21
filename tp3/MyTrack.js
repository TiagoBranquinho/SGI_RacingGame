import * as THREE from 'three';

class MyTrack {

    constructor(app, vehicle) {
        this.app = app;
        this.vehicle = vehicle;

        //Curve related attributes
        this.segments = 200;
        this.width = 8;
        this.textureRepeat = 1;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = true;
        this.closedCurve = false;

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

        //animation parameters

        this.keyPoints = [
            new THREE.Vector3(0, 0.8, 0),   
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
            new THREE.Vector3(-0, 0.8, 0)
        ];

        this.clock = new THREE.Clock()

        this.mixerTime = 0
        this.mixerPause = false

        this.enableAnimationPosition = true
        this.animationMaxDuration = 15 //seconds
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
        this.curve.scale.set(1,0.2,1);
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

        let spline = new THREE.CatmullRomCurve3([...this.keyPoints])

        // Setup visual control points

        for (let i = 0; i < this.keyPoints.length; i++) {
            const geometry = new THREE.SphereGeometry(1, 32, 32)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const sphere = new THREE.Mesh(geometry, material)
            sphere.scale.set(0.2, 0.2, 0.2)
            sphere.position.set(... this.keyPoints[i])

            this.app.scene.add(sphere)
        }

        const tubeGeometry = new THREE.TubeGeometry(spline, 100, 0.05, 10, false)
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
    update() {

        const delta = this.clock.getDelta()
        this.mixer.update(delta)

        this.checkAnimationStateIsPause()
        this.checkTracksEnabled()

    }

    init() {
        this.buildCurve();
        this.vehicle.draw();

        //visual debuging the path and the controls points
        this.debugKeyFrames()

        const positionKF = new THREE.VectorKeyframeTrack('.position', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
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

        const yAxis = new THREE.Vector3(0, 1, 0)
        const q1 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(90))
        const q2 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(110))
        const q3 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(200))
        const q4 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(180))
        const q5 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(90))
        const q6 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-20))
        const q7 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-80))
        const q8 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-60))
        const q9 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(30))
        const q10 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(40))
        const q11 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-10))
        const q12 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-40))
        const q13 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-100))
        const q14 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-150))
        const q15 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-270))


        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ,10 ,11 ,12 ,13 ,14],
            [q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w,
            q4.x, q4.y, q4.z, q4.w,
            q5.x, q5.y, q5.z, q5.w,
            q6.x, q6.y, q6.z, q6.w,
            q7.x, q7.y, q7.z, q7.w,
            q8.x, q8.y, q8.z, q8.w,
            q9.x, q9.y, q9.z, q9.w,
            q10.x, q10.y, q10.z, q10.w,
            q11.x, q11.y, q11.z, q11.w,
            q12.x, q12.y, q12.z, q12.w,
            q13.x, q13.y, q13.z, q13.w,
            q14.x, q14.y, q14.z, q14.w,
            q15.x, q15.y, q15.z, q15.w
        ]
        );

        const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF])
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [quaternionKF])

        // Create an AnimationMixer
        this.mixer = new THREE.AnimationMixer(this.vehicle.model)

        // Create AnimationActions for each clip
        const positionAction = this.mixer.clipAction(positionClip)
        const rotationAction = this.mixer.clipAction(rotationClip)

        // Play both animations
        positionAction.play()
        rotationAction.play()
        
    }

}

export { MyTrack };
