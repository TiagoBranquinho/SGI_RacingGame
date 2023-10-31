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
        console.log(data)
        this.configureGlobals(data.options);

        this.configureFog(data.fog);

        this.configureCameras(data.cameras, data.activeCameraId);

        this.configureTextures(data.textures);

        this.configureMaterials(data.materials);

    }

    configureGlobals(data) {
        if (data.type === "globals") {
            let ambientData = data.ambient;
            if (ambientData.isColor) {
                const color = new THREE.Color(ambientData.r, ambientData.g, ambientData.b)
                const ambientLight = new THREE.AmbientLight(color)
                this.app.scene.add(ambientLight)
            }
            let backgroundData = data.background;
            if (backgroundData.isColor) {
                this.app.scene.background = new THREE.Color(backgroundData.r, backgroundData.g, backgroundData.b)
            }
        }

    }

    configureFog(data) {
        if (data.type === "fog") {
            let colorData = data.color;
            let color = null;
            if (colorData.isColor) {
                color = new THREE.Color(colorData.r, colorData.g, colorData.b)
            }
            let fog = new THREE.Fog(color, data.near, data.far)
            this.app.scene.fog = fog;
        }
    }

    configureCameras(data, activeCameraId) {
        let cameras = {}
        for (var key in data) {
            let camera_el = data[key]
            let camera = null
            if (camera_el.type == "perspective") {
                camera = new THREE.PerspectiveCamera(camera_el.angle)
            }
            else if (camera_el.type == "orthogonal") {
                camera = new THREE.OrthographicCamera(camera_el.left, camera_el.right, camera_el.top, camera_el.bottom)
            }
            camera.near = camera_el.near
            camera.far = camera_el.far
            camera.lookAt(camera_el.target[0], camera_el.target[1], camera_el.target[2])
            camera.position.set(camera_el.location[0], camera_el.location[1], camera_el.location[2])
            cameras[camera_el.id] = camera
        }
        this.app.initCameras(cameras, activeCameraId);
    }

    configureTextures(data) {
        let textures = {}
        for (var key in data) {
            let texture_el = data[key]
            let texture = null
            if (texture_el.type === "texture") {
                if (texture_el.isVideo) {
                    texture = new THREE.VideoTexture(texture_el.filepath)
                }
                else {
                    texture = new THREE.TextureLoader().load(texture_el.filepath)
                }
                texture.anisotropy = texture_el.anisotropy
                //texture.magFilter = texture_el.magFilter === "LinearFilter" ? THREE.LinearFilter : THREE.NearestFilter
                //texture.minFilter = texture_el.minFilter === "LinearMipmapLinearFilter" ? THREE.LinearMipMapLinearFilter : THREE.NearestFilter
                texture.mipmaps = texture_el.mipmaps
            }
            textures[texture_el.id] = texture
        }
        this.app.initTextures(textures);
    }

    configureMaterials(data) {
        let materials = {}
        for (var key in data) {
            let material_el = data[key]
            let material = null
            if (material_el.type === "material") {
                const colorData = material_el.color;
                const emissiveData = material_el.emissive;
                const specularData = material_el.specular;
                const color = new THREE.Color(colorData.r, colorData.g, colorData.b)
                const emissive = new THREE.Color(emissiveData.r, emissiveData.g, emissiveData.b)
                const specular = new THREE.Color(specularData.r, specularData.g, specularData.b)
                const shininess = material_el.shininess
                const bumpMap = material_el.bump_ref
                const bumpScale = material_el.bump_scale
                const flatShading = material_el.shading === "flat" ? true : false
                const twosided = material_el.twosided ? THREE.DoubleSide : THREE.FrontSide
                const wireframe = material_el.wireframe
                const map = this.app.textures[material_el.textureref]
                //missing texlenght_t and s
                material = new THREE.MeshPhongMaterial({ color: color, emissive: emissive, specular: specular, shininess: shininess, bumpMap: bumpMap, bumpScale: bumpScale, flatShading: flatShading, side: twosided, wireframe: wireframe, map: map })
            }
            materials[material_el.id] = material
        }
        this.app.initMaterials(materials);
    }

    createNodes(data) {
        let nodes = {}
        for (var key in data) {
            let node_el = data[key]
            let node = null
            if (node_el.type === "node") {
                node = new THREE.Group()
                for (child in node_el.children) {
                    node.add(this.retrieveNode(node_el.children[child]))
                }
                for (transformation in node_el.transformations) {
                    switch (transformation.type) {
                        case "R":
                            node.rotateX(transformation[0] * (Math.PI / 180))
                            node.rotateY(transformation[1] * (Math.PI / 180))
                            node.rotateZ(transformation[2] * (Math.PI / 180))
                            break;
                        case "T":
                            node.position.set(transformation[0], transformation[1], transformation[2])
                            break;
                        default:
                            console.error("Invalid transformation type: " + transformation.type)
                            break;
                    }
                }
                return node
            }
            else if (node_el.type === "primitive") {
                nodes[node_el.id] = node
            }
            return nodes
        }
    }

    retrieveNode(node) {
        if (node.type === "node") {
            node = new THREE.Group()
            for (child in node.children) {
                node.add(this.retrieveNode(node_el.children[child]))
            }
            for (transformation in node.transformations) {
                switch (transformation.type) {
                    case "R":
                        node.rotateX(transformation[0] * (Math.PI / 180))
                        node.rotateY(transformation[1] * (Math.PI / 180))
                        node.rotateZ(transformation[2] * (Math.PI / 180))
                        break;
                    case "T":
                        node.position.set(transformation[0], transformation[1], transformation[2])
                        break;
                    default:
                        console.error("Invalid transformation type: " + transformation.type)
                        break;
                }
            }
            return node
        }
        else if (node.type === "primitive") {
            switch (node.subtype) {
                case "rectangle":
                    return new THREE.Mesh(new THREE.PlaneGeometry(node.x1 - node.x0, node.y1 - node.y0), this.app.materials[node.materialref])
                case "triangle":
                    return new THREE.Mesh(new THREE.TriangleGeometry(node.x0, node.y0, node.x1, node.y1, node.x2, node.y2), this.app.materials[node.materialref])
                case "cylinder":
                    return new THREE.Mesh(new THREE.CylinderGeometry(node.base, node.top, node.height, node.slices, node.stacks), this.app.materials[node.materialref])
                case "sphere":
                    return new THREE.Mesh(new THREE.SphereGeometry(node.radius, node.slices, node.stacks), this.app.materials[node.materialref])
                case "nurbs":
                    return new THREE.Mesh(new THREE.NURBSSurfaceGeometry(node.degreeU, node.degreeV, node.knotsU, node.knotsV, node.controlvertexes), this.app.materials[node.materialref])
                case "box":
                    return new THREE.Mesh(new THREE.BoxGeometry(node.x1 - node.x0, node.y1 - node.y0, node.z1 - node.z0), this.app.materials[node.materialref])
                case "model3d":
                    return new THREE.Mesh(new THREE.BoxGeometry(node.x1 - node.x0, node.y1 - node.y0, node.z1 - node.z0), this.app.materials[node.materialref])
                case "skybox":
                    return new THREE.Mesh(new THREE.BoxGeometry(node.x1 - node.x0, node.y1 - node.y0, node.z1 - node.z0), this.app.materials[node.materialref])
                default:
                    console.error("Invalid primitive subtype: " + node.subtype)
                    break;
                    
            }
        }
        return nodes
    }

    update() {

    }
}

export { MyContents };