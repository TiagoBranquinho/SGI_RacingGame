
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'

/**
 * This class contains the application object
 */
class MyApp {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents = null
        this.cameraNames = [];
        this.lights = [];
        this.lightHelpersVisible = false;

        this.paused = false;
        this.endGame = false;
        this.clock = new THREE.Clock();

        window.addEventListener('keydown', (event) => {
            if (event.key === 'p' || event.key === 'P') {
                this.paused = !this.paused;
                if (this.paused) {
                    if (!this.contents.track.canPlaceObstacle) {
                        this.contents.track.pickObstacles = false;
                    }
                }
            }
        });
    }
    /**
     * initializes the application
     */
    init() {
        this.controls = null
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        const aspect = window.innerWidth / window.innerHeight;
        const perspective1 = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
        perspective1.position.set(10, 10, 3)
        this.cameras['default'] = perspective1


        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor("#000000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Configure renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild(this.renderer.domElement);

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false);
    }

    /**
     * initializes all the textures
     */
    initTextures(textures) {
        this.textures = textures
    }


    /**
     * initializes all the materials
     */
    initMaterials(materials) {
        this.materials = materials
    }

    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
        this.updateCameraIfRequired()
        this.gui.reset()
    }

    /**
     * initializes all the cameras
     */
    initCameras(cameras, activeCameraName) {
        for (var key in cameras) {
            this.cameraNames.push(key)
        }
        this.cameras = cameras
        this.setActiveCamera(activeCameraName)
        let target = this.activeCamera.target
        this.controls.target.set(target.x, target.y, target.z)
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {
        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName

            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()

            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
                this.controls.enableZoom = true;
                this.controls.update();
            }
            else {
                this.controls.object = this.activeCamera
            }
        }
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {
        this.gui = gui
    }

    endGame() {
        this.contents.endGame();
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render() {
        this.stats.begin()
        this.updateCameraIfRequired()

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update(this.paused, this.endGame, this.clock.getDelta() * 1000);
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls.update();

        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame(this.render.bind(this));

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }
}


export { MyApp };