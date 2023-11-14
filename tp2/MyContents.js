import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

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
        this.nurbsBuilder = new MyNurbsBuilder();
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.reader.open("scenes/t08g01/scene.xml");
        

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

        this.createNodes(data.nodes.scene.children);

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
                const bumpMap = null
                const bumpScale = material_el.bumpscale
                const flatShading = material_el.shading === "flat" ? true : false
                const twosided = material_el.twosided ? THREE.DoubleSide : THREE.FrontSide
                const wireframe = material_el.wireframe
                //missing texlenght_t and s
                const texlength_t = 1 //material_el.texlength_t
                const texlength_s = 1 //material_el.texlength_s

                material = new THREE.MeshPhongMaterial({ color: color, emissive: emissive, specular: specular, shininess: shininess, bumpMap: bumpMap, bumpScale: bumpScale, flatShading: flatShading, side: twosided, wireframe: wireframe })
                if (material_el.textureref !== null) {
                    const map = this.app.textures[material_el.textureref]
                    material.map = map
                    material.map.wrapS = THREE.RepeatWrapping
                    material.map.wrapT = THREE.RepeatWrapping
                    material.map.repeat.x = texlength_s
                    material.map.repeat.y = texlength_t
                }

            }
            materials[material_el.id] = material
        }
        this.app.initMaterials(materials);
    }

    createNodes(data) {
        let nodes = []
        for (var key in data) {
            nodes.push(this.retrieveNode(data[key]))
        }
        for (var key in nodes) {
            this.app.scene.add(nodes[key])
        }
    }

    getPrimitiveMesh(geometry, materialref) {
        return new THREE.Mesh(geometry, this.app.materials[materialref])
    }

    retrieveNode(node, materialref = undefined) {
        if (node.type === "node") {
            let group = new THREE.Group()
            for (var child in node.children) {
                group.add(this.retrieveNode(node.children[child], node.materialIds[0] === undefined ? materialref : node.materialIds[0]))
            }
            for (var el in node.transformations) {
                const transformation = node.transformations[el]
                switch (transformation.type) {
                    case "R":
                        group.rotation.x = group.rotation.x + transformation.rotation[0] * (Math.PI / 180)
                        group.rotation.y = group.rotation.y + transformation.rotation[1] * (Math.PI / 180)
                        group.rotation.z = group.rotation.z + transformation.rotation[2] * (Math.PI / 180)
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
                lod.addLevel(this.retrieveNode(child.node, materialref), child.mindist)
            }
            return lod
        }
        else if (node.type === "primitive") {
            const representation = node.representations[0]
            let geometry = null;
            let mesh = null;
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

                    mesh.position.set((representation.xy2[0] + representation.xy1[0]) / 2, (representation.xy2[1] + representation.xy1[1]) / 2)
                    return mesh;


                /*case "triangle":
                    geometry = new THREE.Geometry();
                    geometry.vertices = [
                        representation.xyz1,
                        representation.xyz2,
                        representation.xyz3,
                    ];
                    const face = new THREE.Face3(0, 1, 2);
                    geometry.faces.push(face);
                    return this.getPrimitiveMesh(geometry, materialref);*/

                case "cylinder":
                    geometry = new THREE.CylinderGeometry(
                        representation.top,
                        representation.base,
                        representation.height,
                        representation.slices,
                        representation.stacks,
                        representation.capsclose,
                        representation.thetastart,
                        representation.thetalength
                    );
                    return this.getPrimitiveMesh(geometry, materialref);

                case "sphere":
                    geometry = new THREE.SphereGeometry(
                        representation.radius,
                        representation.slices,
                        representation.stacks,
                        representation.thetastart,
                        representation.thetalength,
                        representation.phistart,
                        representation.philength
                    );
                    return this.getPrimitiveMesh(geometry, materialref);

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
                    return this.getPrimitiveMesh(geometry, materialref);
                    break;

                case "box":
                    geometry = new THREE.BoxGeometry(representation.xyz2[0] - representation.xyz1[0],
                        representation.xyz2[1] - representation.xyz1[1],
                        representation.xyz2[2] - representation.xyz1[2],
                        representation.parts_x, representation.parts_y,
                        representation.parts_z);
                    mesh = this.getPrimitiveMesh(geometry, materialref);
                    mesh.position.set((representation.xyz2[0] + representation.xyz1[0]) / 2, (representation.xyz2[1] + representation.xyz1[1]) / 2, (representation.xyz2[2] + representation.xyz1[2]) / 2)
                    return mesh;


                //case "model3d":
                //return new THREE.Mesh(new THREE.BoxGeometry(node.x1 - node.x0, node.y1 - node.y0, node.z1 - node.z0), this.app.materials[node.materialref])

                case "skybox":
                    const cubeMapTexture = new THREE.CubeTextureLoader()
                        .setPath('scenes/demo/textures/') // Replace with the path to your skybox textures
                        .load(['right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png']);

                    geometry = new THREE.BoxGeometry(
                        representation.width,
                        representation.height,
                        representation.depth
                    );

                    const material = new THREE.MeshBasicMaterial({
                        envMap: cubeMapTexture,
                        side: THREE.BackSide // Make the cube visible from the inside DoubleSide//FrontSide
                    });

                    mesh = new THREE.Mesh(geometry, material);


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
            lightGroup.add(light);
            const helper = new THREE.SpotLightHelper(light);
            lightGroup.add(helper);
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
            lightGroup.add(light);
            const helper = new THREE.PointLightHelper(light);
            lightGroup.add(helper);
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
            lightGroup.add(light);
            const helper = new THREE.DirectionalLightHelper(light);
            lightGroup.add(helper);
            return lightGroup;
        }
    }

    update() {
    }
}

export { MyContents };