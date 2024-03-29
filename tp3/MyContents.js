import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyTriangle } from './MyTriangle.js';
import { MySceneData } from './parser/MySceneData.js';
import { MyModel3D } from './Model3d.js';
import { MyPolygon } from './MyPolygon.js';
import { MyTrack } from './MyTrack.js';
import { MyMenu } from './MyMenu.js';
import { MyVehicle } from './MyVehicle.js';
import { MyFirework } from './MyFirework.js';
import { MyEndGameHandler } from './MyEndGameHandler.js';
import { MyShader } from './MyShader.js';

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
        this.data = null;
        this.nurbsBuilder = new MyNurbsBuilder();
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.endGameHandler = null;
        this.restart = false;
        this.backToMenu = false;
        //this.reader.open("scenes/SGI_TP2_XML_T07_G07_V02/SGI_TP2_XML_T07_G07_V02.xml");

        this.fireworks = [];
        this.setFireworks = false;
        this.car = null;
        this.car2 = null;
        this.difficulty = null;
        this.name = null;

        this.trafficConeTex = new THREE.TextureLoader().load('t08g01/textures/cone.jpg');
        this.trafficConeTex.wrapS = THREE.RepeatWrapping;
        this.trafficConeTex.wrapT = THREE.RepeatWrapping;

        this.trafficConeMap = new THREE.TextureLoader().load('t08g01/textures/trafficConeMap.jpg');
        this.trafficConeApp = new MyShader(this.app, "t08g01/shaders/texture2.vert", "t08g01/shaders/texture3anim.frag", {
            uSampler1: {type: 'sampler2D', value: this.trafficConeTex },
            uSampler2: {type: 'sampler2D', value: this.trafficConeMap },
            normScale: {type: 'f', value: 0.1 },
            displacement: {type: 'f', value: 0.0 },
            normalizationFactor: {type: 'f', value: 1 },
            blendScale: {type: 'f', value: 0.5 },
            timeFactor: {type: 'f', value: 0.0 },
            isPicked: {type: 'bool', value: false },
            
        })

        this.speedRampTex = new THREE.TextureLoader().load('t08g01/textures/speedRamp.jpg');
        this.speedRampTex.wrapS = THREE.RepeatWrapping;
        this.speedRampTex.wrapT = THREE.RepeatWrapping;

        this.speedRampMap = new THREE.TextureLoader().load('t08g01/textures/speedRamp.jpg');
        this.speedRampApp = new MyShader(this.app, "t08g01/shaders/texture1.vert", "t08g01/shaders/texture2anim.frag", {
            uSampler1: {type: 'sampler2D', value: this.speedRampTex },
            uSampler2: {type: 'sampler2D', value: this.speedRampMap },
            normScale: {type: 'f', value: 0.1 },
            displacement: {type: 'f', value: 0.0 },
            normalizationFactor: {type: 'f', value: 1 },
            blendScale: {type: 'f', value: 0.5 },
            timeFactor: {type: 'f', value: 0.0 },
            
        })

        this.screenTex = new THREE.TextureLoader().load('t08g01/textures/finishLine.jpg');
        this.screenTex.wrapS = THREE.RepeatWrapping;
        this.screenTex.wrapT = THREE.RepeatWrapping;

        this.screenMap = new THREE.TextureLoader().load('t08g01/textures/outdoorMap.jpg');
        this.screenApp = new MyShader(this.app, "t08g01/shaders/texture3.vert", "t08g01/shaders/texture1.frag", {
            uSampler1: {type: 'sampler2D', value: this.screenTex },
            uSampler2: {type: 'sampler2D', value: this.screenMap },
            normScale: {type: 'f', value: 0.1 },
            displacement: {type: 'f', value: 0.0 },
            normalizationFactor: {type: 'f', value: 1 },
            blendScale: {type: 'f', value: 0.5 },
            timeFactor: {type: 'f', value: 0.0 },
        })

        this.coneApps = [];
    }

    showMenu() {
        this.menu = new MyMenu(this);
        this.menu.display();
        if (this.axis === null) {
            this.axis = new MyAxis(this.app)
            this.app.scene.add(this.axis)
        }
    }

    startGame(car, car2, difficulty, laps, name) {
        this.app.init();
        this.laps = laps.laps;
        const canvas = document.getElementById("canvas");
        canvas.removeChild(canvas.childNodes[1]);
        this.reader.open("t08g01/scene.xml");
        this.car = car;
        this.car2 = car2;
        this.difficulty = difficulty;
        this.name = name;
        let player = new MyVehicle(this.app, car.clone(), 0, name);
        let bot = new MyVehicle(this.app, car2.clone(), difficulty);
        player.model.position.z = 3
        bot.model.position.z = -3
        this.track = new MyTrack(this.app, player, bot)
        this.track.laps = this.laps;
        this.track.init()

        this.app.paused = true; // Pause the game
        let countdown = 3; // 3 seconds countdown
        let previousText = null;
        let countdownInterval = setInterval(async () => {
            if (countdown > 0) {
                // Remove the previous text from the scene
                if (previousText) {
                    this.app.scene.remove(previousText);
                }

                // Add the countdown to the screen and store it in previousText
                previousText = await this.addText(countdown + '...', new THREE.Vector3(-2, 4, 0), 1.2, this.app.activeCamera.position, true);
                countdown--;
            } else {
                // Remove the previous text from the scene
                if (previousText) {
                    this.app.scene.remove(previousText);
                }

                previousText = await this.addText('Go!', new THREE.Vector3(-2, 4, 0), 1.2, this.app.activeCamera.position, true);
                clearInterval(countdownInterval);
                this.app.paused = false; // Start the game

                // Remove the 'Go!' text after 1 second
                setTimeout(() => {
                    if (previousText) {
                        this.app.scene.remove(previousText);
                    }
                }, 1000);
            }
        }, 1000);
    }

    endGame() {
        this.backToMenuGroup = [];
        this.restartGroup = [];
        this.track.removeListener();
        let playerTime = Math.floor(this.track.mixer.time - this.track.player.time)
        let botTime = this.track.laps * this.track.animationMaxDuration
        let winner = ""
        let loser = ""
        if (playerTime < botTime) {
            winner = "1st: " + this.track.player.name + " - " + playerTime + "s"
            loser = "2nd: " + this.track.bot.name + " - " + botTime + "s"

        }
        else {
            winner = "1st: " + this.track.bot.name + " - " + botTime + "s"
            loser = "2nd: " + this.track.player.name + " - " + playerTime + "s"
        }
        this.addText(winner, new THREE.Vector3(100, 100, 295), 20, new THREE.Vector3(0, 0, -100), true);
        this.addText(loser, new THREE.Vector3(100, 75, 295), 20, new THREE.Vector3(0, 0, -100), true);
        this.addButton(new THREE.Vector3(75, 50, 295), 50, 20, 0x0088ff, 'Back To Menu', 5, new THREE.Vector3(0, 0, -100), true);
        this.addButton(new THREE.Vector3(-25, 50, 295), 50, 20, 0x0088ff, 'Restart Race', 5.5, new THREE.Vector3(0, 0, -100), true);

        this.app.activeCamera.position.set(0, 75, 100);
        this.app.activeCamera.lookAt(new THREE.Vector3(0, 75, 295));
        this.app.controls.target.set(0, 75, 295);
        this.app.controls.enabled = false;
        this.app.activeCamera.updateProjectionMatrix();
        this.setFireworks = true;
        this.endGameHandler = new MyEndGameHandler(this, this.restartGroup, this.backToMenuGroup);
    }

    restartGame(car, car2, difficulty, name) {
        this.initCameras();
        this.app.controls.enabled = true;
        this.track.resetPicking();
        for (let i = this.app.scene.children.length - 1; i >= 0; i--) {
            let obj = this.app.scene.children[i];
            this.app.scene.remove(obj);
        }

        this.app.endGame = false;

        this.onAfterSceneLoadedAndBeforeRender(this.data);

        let player = new MyVehicle(this.app, car.clone(), 0, name);
        let bot = new MyVehicle(this.app, car2.clone(), difficulty);
        player.model.position.z = 3
        bot.model.position.z = -3
        this.track = new MyTrack(this.app, player, bot)
        this.track.laps = this.laps;
        this.track.init()

        this.app.paused = true; // Pause the game
        let countdown = 3; // 3 seconds countdown
        let previousText = null;
        let countdownInterval = setInterval(async () => {
            if (countdown > 0) {
                // Remove the previous text from the scene
                if (previousText) {
                    this.app.scene.remove(previousText);
                }

                // Add the countdown to the screen and store it in previousText
                previousText = await this.addText(countdown + '...', new THREE.Vector3(-2, 4, 0), 1.2, this.app.activeCamera.position, true);
                countdown--;
            } else {
                // Remove the previous text from the scene
                if (previousText) {
                    this.app.scene.remove(previousText);
                }

                previousText = await this.addText('Go!', new THREE.Vector3(-2, 4, 0), 1.2, this.app.activeCamera.position, true);
                clearInterval(countdownInterval);
                this.app.paused = false; // Start the game

                // Remove the 'Go!' text after 1 second
                setTimeout(() => {
                    if (previousText) {
                        this.app.scene.remove(previousText);
                    }
                }, 1000);
            }
        }, 1000);
    }

    restartMenu() {
        this.app.controls.enabled = true;
        for (let i = this.app.scene.children.length - 1; i >= 0; i--) {
            let obj = this.app.scene.children[i];
            this.app.scene.remove(obj);
        }

        this.app.endGame = false;
        this.menu = new MyMenu(this);
        this.menu.display();
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
        this.data = data;
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    /**  
     * Creates the scene from the scene graph
     * @param {MySceneData} data the data of the scene
     */
    onAfterSceneLoadedAndBeforeRender(data) {
        console.log(data)
        this.configureGlobals(data.options);

        this.configureFog(data.fog);

        this.configureTextures(data.textures);

        this.configureMaterials(data.materials);

        this.configureSkyBoxes(data.skyboxes);

        let rootNode = data.rootId;

        this.createNodes(data.nodes[rootNode].children, data.nodes[rootNode].materialIds[0], data.nodes[rootNode].castShadows, data.nodes[rootNode].receiveShadows);

        this.configureCameras(data.cameras, data.activeCameraId);


    }

    /**  
     * Creates the global settings from the scene graph
     * @param {MySceneData} data the data of the global settings
     */
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

    /**  
     * Creates a fog from the scene graph
     * @param {MySceneData} data the data of the fog
     */
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

    /**  
     * Creates a camera from the scene graph
     * @param {MySceneData} data the data of the camera
     * @param {string} activeCameraId the id of the active camera
     */
    configureCameras(data, activeCameraId) {
        let cameras = {}
        for (var key in data) {
            let camera_el = data[key]
            let camera = null
            if (camera_el.type == "perspective") {
                camera = new THREE.PerspectiveCamera(camera_el.angle)
                camera.target = { x: camera_el.target[0], y: camera_el.target[1], z: camera_el.target[2] }
            }
            else if (camera_el.type == "orthogonal") {
                camera = new THREE.OrthographicCamera(camera_el.left, camera_el.right, camera_el.top, camera_el.bottom)
            }
            camera.near = camera_el.near
            camera.far = camera_el.far
            camera.position.set(camera_el.location[0], camera_el.location[1], camera_el.location[2])
            camera.lookAt(new THREE.Vector3(camera_el.target[0], camera_el.target[1], camera_el.target[2]))
            cameras[camera_el.id] = camera
        }
        this.app.initCameras(cameras, activeCameraId);
    }

    /**  
     * Stores the textures in the scene graph
     * @param {MySceneData} data the list of textures
     */
    configureTextures(data) {
        this.app.initTextures(data);
    }

    /**  
     * Creates a texture from the scene graph
     * @param {MySceneData} data the data of the texture
     */
    createTexture(texture_id) {
        let texture_el = this.app.textures[texture_id]
        if (texture_el === undefined) {
            return null
        }
        let texture = null
        if (texture_el.type === "texture") {
            if (texture_el.isVideo) {
                const video_html = document.createElement('video');
                video_html.style.display = 'none';
                video_html.id = texture_el.id;
                video_html.autoplay = true;
                video_html.muted = true;
                video_html.preload = 'auto';
                video_html.width = 640;
                video_html.height = 264;
                video_html.loop = true;
                const source = document.createElement('source');
                source.src = texture_el.filepath;
                source.type = 'video/mp4';

                // Append the source element to the video element
                video_html.appendChild(source);

                // Append the video element to the document body (or another desired location)
                document.body.appendChild(video_html);
                const video = document.getElementById(texture_el.id);
                if (video === null) {
                    console.error("Video element not found")
                }
                texture = new THREE.VideoTexture(video);
                texture.colorSpace = THREE.SRGBColorSpace;
            }
            else {
                texture = new THREE.TextureLoader().load(texture_el.filepath);
                texture.minFilter = texture_el.minFilter === "LinearMipmapLinearFilter" ? THREE.LinearMipMapLinearFilter : THREE.NearestFilter
                texture.magFilter = texture_el.magFilter === "LinearFilter" ? THREE.LinearFilter : THREE.NearestFilter
                if (!texture_el.mipmaps) {
                    texture.generateMipMaps = false

                    for (let i = 0; i < 8; i++) {
                        if (texture_el["mipmap" + i] != null) {
                            this.loadMipmap(texture, i, texture_el[`mipmap${i}`]);
                        }
                    }
                }


            }
            texture.anisotropy = texture_el.anisotropy

        }
        return texture
    }

    /**  
     * Creates a material from the scene graph
     * @param {MySceneData} data the data of the material
     */
    createMaterial(material_id) {
        let material_el = this.app.materials[material_id]
        if (material_el === undefined) {
            return new THREE.MeshPhongMaterial()
        }
        let material = null
        if (material_el.type === "material") {
            const colorData = material_el.color;
            const emissiveData = material_el.emissive;
            const specularData = material_el.specular;
            const color = new THREE.Color(colorData.r, colorData.g, colorData.b)
            const emissive = new THREE.Color(emissiveData.r, emissiveData.g, emissiveData.b)
            const specular = new THREE.Color(specularData.r, specularData.g, specularData.b)
            const shininess = material_el.shininess

            const bumpScale = material_el.bumpscale
            const flatShading = material_el.shading === "flat" ? true : false
            const twosided = material_el.twosided ? THREE.DoubleSide : THREE.FrontSide
            const wireframe = material_el.wireframe
            //missing texlenght_t and s
            const texlength_t = material_el.texlength_t
            const texlength_s = material_el.texlength_s

            let bumpMap = this.createTexture(material_el.bumpref)
            let specularMap = this.createTexture(material_el.specularref)

            material = new THREE.MeshPhongMaterial({ color: color, emissive: emissive, specular: specular, shininess: shininess, bumpMap: bumpMap, specularMap: specularMap, bumpScale: bumpScale, flatShading: flatShading, side: twosided, wireframe: wireframe })
            if (material_el.textureref !== null) {
                const map = this.createTexture(material_el.textureref)
                material.map = map
                material.map.wrapS = THREE.RepeatWrapping
                material.map.wrapT = THREE.RepeatWrapping
                material.map.repeat.x = texlength_s
                material.map.repeat.y = texlength_t
            }

            if (material_el.id === "trafficConeApp") {
                
                material = this.trafficConeApp.material;
                material.defaultAttributeValues.uv = texlength_s
                material.defaultAttributeValues.uv1 = texlength_t
            }
            else if (material_el.id === "speedRampApp") {             
                material = this.speedRampApp.material;
                material.defaultAttributeValues.uv = texlength_s
                material.defaultAttributeValues.uv1 = texlength_t
            }

        }
        return material
    }


    /**  
     * Stores the materials in the scene graph
     * @param {MySceneData} data the list of materials
     */
    configureMaterials(data) {
        this.app.initMaterials(data);
    }

    /**  
     * Creates a skybox from the scene graph
     * @param {MySceneData} data the data of the skybox
     */
    configureSkyBoxes(data) {
        let skyboxes = {}
        for (var key in data) {
            let skybox_el = data[key]
            let skybox = null
            if (skybox_el.type === "skybox") {
                const cubeMapTexture = new THREE.CubeTextureLoader()
                    .load([skybox_el.right, skybox_el.left, skybox_el.up, skybox_el.down, skybox_el.front, skybox_el.back]);

                const geometry = new THREE.BoxGeometry(
                    skybox_el.size[0],
                    skybox_el.size[1],
                    skybox_el.size[2]
                );
                const colorData = skybox_el.emissive;
                let color = null;
                if (colorData.isColor) {
                    color = new THREE.Color(colorData.r, colorData.g, colorData.b)
                }
                const material = new THREE.MeshPhongMaterial({
                    color: color,
                    emissiveIntensity: skybox_el.intensity,
                    envMap: cubeMapTexture,
                    side: THREE.BackSide
                });

                skybox = new THREE.Mesh(geometry, material);
                skybox.position.set(skybox_el.center[0], skybox_el.center[1], skybox_el.center[2])
            }
            skyboxes[skybox_el.id] = skybox

        }
        for (var key in skyboxes) {
            this.app.scene.add(skyboxes[key])
        }
    }

    /**  
     * Creates a node from the scene graph
     * @param {MySceneData} data the data of the node
     * @param {string} materialref the material to use in the node
     * @param {boolean} castShadow whether the node should cast shadows
     * @param {boolean} receiveShadow whether the node should receive shadows
     */
    createNodes(data, materialref = undefined, castShadow = false, receiveShadow = false) {
        let nodes = []
        for (var key in data) {
            nodes.push(this.retrieveNode(data[key], materialref, castShadow, receiveShadow, "scene&"))
        }
        for (var key in nodes) {
            this.app.scene.add(nodes[key])
        }
    }

    /**  
     * Retrieves a primitive mesh from the scene graph
     * @param {Object} geometry the geometry of the mesh
     * @param {string} materialref the material to use in the mesh
     * @returns {THREE.Mesh} the mesh
     */
    getPrimitiveMesh(geometry, materialref) {
        let material = this.createMaterial(materialref)
        if (material.map === null) {
            let texture = new THREE.TextureLoader().load("t08g01/textures/bottle.jpg");
            material.map = texture;
        }
        let mesh = null;
        if (materialref === "trafficConeApp") {
            let coneMat = material.clone();
            this.coneApps.push(coneMat);
            mesh = new THREE.Mesh(geometry, coneMat)
        }
        else {
            mesh = new THREE.Mesh(geometry, material)
        }
        return mesh
    }

    processModel3D(model3d) {
        let object = new THREE.Object3D();
        MyModel3D.loadModel(model3d.filepath).then((gltf) => {
            object.add(gltf.scene);
        });
        object.name = model3d.filepath
        return object;
    }


    /**  
     * Retrieves a node from the scene graph
     * @param {Object} node the node to retrieve
     * @param {string} materialref the material to use in the node
     * @param {boolean} castShadow whether the node should cast shadows
     * @param {boolean} receiveShadow whether the node should receive shadows
     * @param {string} name the name of the node
     * @returns {THREE.Group} the node
     */
    retrieveNode(node, materialref = undefined, castShadow = false, receiveShadow = false, name = "") {

        if (node.type === "node") {
            let group = new THREE.Group()
            group.name = name
            for (var child in node.children) {
                group.add(this.retrieveNode(node.children[child], node.materialIds[0] === undefined ? materialref : node.materialIds[0], castShadow === true ? castShadow : node.castShadows, receiveShadow === true ? receiveShadow : node.receiveShadows, name + '&' + node.id))
            }
            for (var el in node.transformations) {
                const transformation = node.transformations[el]
                switch (transformation.type) {
                    case "R":
                        group.rotation.x = group.rotation.x + transformation.rotation[0]
                        group.rotation.y = group.rotation.y + transformation.rotation[1]
                        group.rotation.z = group.rotation.z + transformation.rotation[2]
                        break;
                    case "T":
                        group.position.set(group.position.x + transformation.translate[0], group.position.y + transformation.translate[1], group.position.z + transformation.translate[2])
                        break;
                    case "S":
                        group.scale.set(group.scale.x * transformation.scale[0], group.scale.y * transformation.scale[1], group.scale.z * transformation.scale[2])
                        break;
                    default:
                        console.error("Invalid transformation type: " + transformation.type)
                        break;
                }
            }
            return group
        }
        else if (node.type === "lod") {
            let lod = new THREE.LOD()
            for (var el in node.children) {
                const child = node.children[el]
                lod.addLevel(this.retrieveNode(child.node, materialref, castShadow, receiveShadow), child.mindist)
            }
            return lod
        }
        else if (node.type === "primitive") {
            const representation = node.representations[0]
            let geometry = null;
            let mesh = null;
            let texWidth = 0;
            let texHeight = 0;
            switch (node.subtype) {
                case "rectangle":
                    let width = representation.xy2[0] - representation.xy1[0];
                    let height = representation.xy2[1] - representation.xy1[1];
                    geometry = new THREE.PlaneGeometry(
                        width,
                        height,
                        representation.parts_x,
                        representation.parts_y
                    );

                    mesh = this.getPrimitiveMesh(geometry, materialref);
                    texWidth = width > 0 ? width : -width;
                    texHeight = height > 0 ? height : -height;
                    if (materialref === "speedRampApp") {
                        mesh.material.defaultAttributeValues.uv = texWidth / mesh.material.defaultAttributeValues.uv;
                        mesh.material.defaultAttributeValues.uv1 = texHeight / mesh.material.defaultAttributeValues.uv1;
                    }
                    else {
                        mesh.material.map.repeat.x = texWidth / mesh.material.map.repeat.x;
                        mesh.material.map.repeat.y = texHeight / mesh.material.map.repeat.y;
                    }
                    mesh.castShadow = castShadow;
                    mesh.receiveShadow = receiveShadow;

                    mesh.position.set((representation.xy2[0] + representation.xy1[0]) / 2, (representation.xy2[1] + representation.xy1[1]) / 2)

                    return mesh;


                case "triangle":
                    geometry = new MyTriangle(representation.xyz1, representation.xyz2, representation.xyz3);
                    mesh = this.getPrimitiveMesh(geometry, materialref);
                    mesh.castShadow = castShadow;
                    mesh.receiveShadow = receiveShadow;

                    return mesh;

                case "cylinder":
                    geometry = new THREE.CylinderGeometry(
                        representation.top,
                        representation.base,
                        representation.height,
                        representation.slices,
                        representation.stacks,
                        !representation.capsclose,
                        representation.thetastart,
                        representation.thetalength
                    );
                    mesh = this.getPrimitiveMesh(geometry, materialref);
                    texWidth = representation.base > 0 ? representation.base : -representation.base;
                    texHeight = representation.top > 0 ? representation.top : -representation.top;
                    if (materialref === "trafficConeApp") {
                        mesh.material.defaultAttributeValues.uv = texWidth / mesh.material.defaultAttributeValues.uv;
                        mesh.material.defaultAttributeValues.uv1 = texHeight / mesh.material.defaultAttributeValues.uv1;
                    }
                    else {
                        mesh.material.map.repeat.x = texWidth / mesh.material.map.repeat.x;
                        mesh.material.map.repeat.y = texHeight / mesh.material.map.repeat.y;
                    }
                    mesh.castShadow = castShadow;
                    mesh.receiveShadow = receiveShadow;

                    return mesh;

                case "sphere":
                    geometry = new THREE.SphereGeometry(
                        representation.radius,
                        representation.stacks,
                        representation.slices,
                        representation.phistart,
                        representation.philength,
                        representation.thetastart,
                        representation.thetalength
                    );

                    mesh = this.getPrimitiveMesh(geometry, materialref);
                    // Adjust the texture to the sphere
                    texWidth = representation.radius > 0 ? representation.radius : -representation.radius;
                    texHeight = representation.radius > 0 ? representation.radius : -representation.radius;
                    mesh.material.map.repeat.x = texWidth / mesh.material.map.repeat.x;
                    mesh.material.map.repeat.y = texHeight / mesh.material.map.repeat.y;
                    mesh.castShadow = castShadow;
                    mesh.receiveShadow = receiveShadow;
                    return mesh;

                case "nurbs":
                    let controlPoints = []
                    for (let i = 0; i <= representation.degree_u; i++) {
                        controlPoints.push([])
                        for (let j = 0; j <= representation.degree_v; j++) {
                            let controlPoint = representation.controlpoints[i * (representation.degree_v + 1) + j]
                            controlPoints[i].push([controlPoint.xx, controlPoint.yy, controlPoint.zz, 1])
                        }
                    }
                    geometry = this.nurbsBuilder.build(
                        controlPoints,
                        representation.degree_u,
                        representation.degree_v,
                        representation.parts_u,
                        representation.parts_v
                    );
                    mesh = this.getPrimitiveMesh(geometry, materialref);
                    mesh.castShadow = castShadow;
                    mesh.receiveShadow = receiveShadow;

                    return mesh;

                case "box":
                    geometry = new THREE.BoxGeometry(representation.xyz2[0] - representation.xyz1[0],
                        representation.xyz2[1] - representation.xyz1[1],
                        representation.xyz2[2] - representation.xyz1[2],
                        representation.parts_x, representation.parts_y,
                        representation.parts_z);
                    mesh = this.getPrimitiveMesh(geometry, materialref);
                    mesh.position.set((representation.xyz2[0] + representation.xyz1[0]) / 2, (representation.xyz2[1] + representation.xyz1[1]) / 2, (representation.xyz2[2] + representation.xyz1[2]) / 2)
                    mesh.castShadow = castShadow;
                    mesh.receiveShadow = receiveShadow;

                    return mesh;


                case "model3d":
                    return this.processModel3D(representation);

                case "polygon":
                    let polygon = new MyPolygon(representation.radius,
                        representation.stacks,
                        representation.slices,
                        new THREE.Color(representation.color_c.r, representation.color_c.g, representation.color_c.b),
                        new THREE.Color(representation.color_p.r, representation.color_p.g, representation.color_p.b));
                    mesh = new THREE.Mesh(polygon);
                    mesh.material.vertexColors = true
                    mesh.castShadow = castShadow;
                    mesh.receiveShadow = receiveShadow;

                    return mesh;


                default:
                    console.error("Invalid primitive subtype: " + node.subtype)
                    break;

            }
        }
        else if (node.type === "spotlight") {
            let colorData = node.color;
            let color = null;
            if (colorData.isColor) {
                color = new THREE.Color(colorData.r, colorData.g, colorData.b)
            }
            let lightGroup = new THREE.Group();
            let light = new THREE.SpotLight(color, node.intensity, node.distance, node.angle, node.penumbra, node.decay);
            light.enabled = node.enabled;
            light.castShadow = node.castshadow;
            light.position.set(node.position[0], node.position[1], node.position[2]);
            light.target.position.set(node.target[0], node.target[1], node.target[2]);
            light.distance = node.distance;
            light.shadow.mapSize.width = node.shadowmapsize;
            light.shadow.mapSize.height = node.shadowmapsize;
            light.shadow.camera.far = node.shadowfar;
            light.name = node.id;
            lightGroup.add(light);
            let helper = new THREE.SpotLightHelper(light);
            helper.visible = false;
            lightGroup.add(helper);
            this.app.lights.push(lightGroup);
            return lightGroup;
        }
        else if (node.type === "pointlight") {
            let colorData = node.color;
            let color = null;
            if (colorData.isColor) {
                color = new THREE.Color(colorData.r, colorData.g, colorData.b)
            }
            let lightGroup = new THREE.Group();
            let light = new THREE.PointLight(color, node.intensity, node.distance, node.decay);
            light.enabled = node.enabled;
            light.castShadow = node.castshadow;
            light.position.set(node.position[0], node.position[1], node.position[2]);
            light.distance = node.distance;
            light.shadow.mapSize.width = node.shadowmapsize;
            light.shadow.mapSize.height = node.shadowmapsize;
            light.shadow.camera.far = node.shadowfar;
            light.name = node.id;
            lightGroup.add(light);
            let helper = new THREE.PointLightHelper(light);
            helper.visible = false;
            lightGroup.add(helper);
            this.app.lights.push(lightGroup);
            return lightGroup;
        }
        else if (node.type === "directionallight") {
            let colorData = node.color;
            let color = null;
            if (colorData.isColor) {
                color = new THREE.Color(colorData.r, colorData.g, colorData.b)
            }
            let lightGroup = new THREE.Group();
            let light = new THREE.DirectionalLight(color, node.intensity, node.distance, node.decay);
            light.enabled = node.enabled;
            light.castShadow = node.castshadow;
            light.position.set(node.position[0], node.position[1], node.position[2]);
            light.shadow.left = node.shadowleft;
            light.shadow.right = node.shadowright;
            light.shadow.top = node.shadowtop;
            light.shadow.bottom = node.shadowbottom;
            light.shadow.mapSize.width = node.shadowmapsize;
            light.shadow.mapSize.height = node.shadowmapsize;
            light.shadow.camera.far = node.shadowfar;
            light.name = node.id;
            lightGroup.add(light);
            let helper = new THREE.DirectionalLightHelper(light);
            helper.visible = false;
            lightGroup.add(helper);
            this.app.lights.push(lightGroup);
            return lightGroup;
        }
    }

    /**  
     * Loads a mipmap image and sets it in the parent texture in the specified level
     * @param {THREE.TextureLoader} parentTexture the parent texture
     * @param {number} level the mipmap level
     * @param {string} path the path to the image
     */
    loadMipmap(parentTexture, level, path) {
        // load texture. On loaded call the function to create the mipmap for the specified level 
        new THREE.TextureLoader().load(path,
            function (mipmapTexture)  // onLoad callback
            {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);

                // const fontSize = 48
                const img = mipmapTexture.image
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0)

                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function (err) {
                console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
            }
        )
    }

    draw(obj) {
        this.app.scene.add(obj);
    }

    async addText(text, position, size, orientation, draw = false) {
        return new Promise((resolve, reject) => {
            const loader = new FontLoader();

            loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                const textGeometry = new TextGeometry(text, {
                    font: font,
                    size: size,  // Adjust the size as needed
                    height: draw ? 0.01 : 0.1,  // Adjust the height as needed
                    curveSegments: 12,
                    bevelEnabled: false
                });

                const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.lookAt(orientation);
                textMesh.position.copy(position);
                if (draw) {
                    this.draw(textMesh);
                }
                // Resolve with the created text mesh
                resolve(textMesh);
            });
        });
    }

    async addButton(position, length, height, color, text, size, orientation, draw = false) {
        let buttonGroup = new THREE.Group();
        // Create a button
        const buttonGeometry = new THREE.BoxGeometry(length, height, 0.2);
        const buttonMaterial = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        // Position the button below the car
        button.position.copy(position);
        if (text === 'Restart Race') {
            button.restart = true;
        }
        else if (text === 'Back To Menu') {
            button.backToMenu = true;
        }
        buttonGroup.add(button);
        let labelPosition = button.position.clone();
        labelPosition.x += length / 2 - size / 2;
        labelPosition.y -= size / 2;
        // Create a text label for the button
        let label = await this.addText(text, labelPosition, size, orientation); // Corrected here
        buttonGroup.add(label);
        if (draw) {
            if (text === 'Restart Race') {
                this.restartGroup.push(button);
            }
            else if (text === 'Back To Menu') {
                this.backToMenuGroup.push(button);
            }
            this.draw(buttonGroup);
        }
        return buttonGroup;
    }

    update(paused, endGame, deltaTime) {
        if (this.track !== undefined && this.track !== null) {
            this.track.update(paused, endGame, deltaTime);
            if (this.screenApp !== undefined && this.screenApp !== null) {
                if (this.screenApp.hasUniform("timeFactor")) {
                    this.screenApp.updateUniformsValue("timeFactor", this.track.mixer.time);
                }
            }
            if (this.speedRampApp !== undefined && this.speedRampApp !== null) {
                if (this.speedRampApp.hasUniform("timeFactor")) {
                    this.speedRampApp.updateUniformsValue("timeFactor", this.track.mixer.time);
                }
            }
            for (let coneApp of this.coneApps) {
                if (coneApp !== undefined && coneApp !== null) {
                    if (coneApp.uniforms["timeFactor"].value !== undefined && coneApp.uniforms["timeFactor"].value !== null) {
                        coneApp.uniforms["timeFactor"].value = this.track.mixer.time;
                    }
                }
            }
        }

        if (this.setFireworks) {
            if (Math.random() < 0.05) {
                this.fireworks.push(new MyFirework(this.app, this))
            }

            // for each fireworks 
            for (let i = 0; i < this.fireworks.length; i++) {
                // is firework finished?
                if (this.fireworks[i].done) {
                    // remove firework 
                    this.fireworks.splice(i, 1)
                    continue
                }
                // otherwise upsdate  firework
                this.fireworks[i].update()
            }
        }
    }
    initCameras() {
        const initialCameras = [
            {
                id: 'camera1',
                type: 'perspective',
                angle: 75,
                near: 0.1,
                far: 1000,
                location: [0, 0, 8],
                target: [0, 0, 0]
            },
            // Add more cameras as needed
        ];
        this.configureCameras(initialCameras, 'camera1');
    }
}

export { MyContents };