import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.axis = null
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.reader.open("scenes/demo/demo.xml");
    }

    /**
     * initializes the contents
     */
    init() {
        if (this.axis === null) {
            this.axis = new MyAxis(this.app)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        this.setupCameras(data);

        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item


        this.output(data.options)
        console.log("textures:")
        for (var key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }

        console.log("materials:")
        for (var key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }
        console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }


        console.log("nodes:")
        for (var key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i = 0; i < node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with " + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }
    }

    setupCameras(data) {
        let cameras = {}
        for (var key in data.cameras) {
            let camera_data = data.cameras[key]
            let camera = null
            if (camera_data.type == "perspective") {
                camera = new THREE.PerspectiveCamera(camera_data.angle, camera_data.near, camera_data.far, camera_data.position, camera_data.target)
                camera.position.set(camera_data.location.x, camera_data.location.y, camera_data.location.z)
            }
            else if (camera_data.type == "orthogonal") {
                camera = new THREE.OrthographicCamera(camera_data.left, camera_data.right, camera_data.top, camera_data.bottom, camera_data.near, camera_data.far)
                camera.position.set(camera_data.location.x, camera_data.location.y, camera_data.location.z)
                camera.lookAt(camera_data.target)
            }
            cameras[camera_data.id] = camera
        }
        this.app.initCameras(cameras, data.activeCameraId);
    }

    update() {

    }
}

export { MyContents };