import * as THREE from 'three';

class MyObstacles {

    constructor(app) {
        this.app = app;
        this.obstacleNodes = {};
        this.obstacles = new Map();
        this.objectList = [];
        this.init();

        //generate material
        // Assuming you have a texture loader and the texture is loaded
        let textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load('t08g01/textures/cone.jpg');

        // Adjust the texture repeat values
        texture.repeat.set(0.01, 0.01);

        // Create the material
        this.coneMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(1.0, 0.3, 0.0),
            emissive: new THREE.Color(0.0, 0.0, 0.0),
            specular: new THREE.Color(0, 0, 0),
            shininess: 0,
            map: texture,
            side: THREE.DoubleSide // This makes the material two-sided
        });
    }
    init() {
        for (let type of ['cones', 'barrels']) {
            this.obstacleNodes[type] = this.dfs(this.app.scene.children[4], type)
        }
        this.update();
    }

    read() {
        for (let i = 0; i < this.objectList.length; i++) {
            this.registerInitialColors(this.objectList[i])
        }
    }

    update() {
        for (let type of ['cones', 'barrels']) {
            for (let i = 0; i < this.obstacleNodes[type].children.length; i++) {
                const child = this.obstacleNodes[type].children[i];
                this.obstacles.set(new THREE.Vector3(child.position.x, child.position.y, child.position.z), type.slice(0, -1));
                this.objectList.push(child);
            }
        }
    }

    getPosition(obj) {
        return obj.position;
    }

    dfs(node, name) {
        const temp = node.name.split("&");
        if (temp[temp.length - 1] === name) {
            return node.parent;
        }
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            const result = this.dfs(child, name);
            if (result !== null) {
                return result;
            }
        }
        return null;
    }

    checkCollision(position, radius) {
        for (let [coord, type] of this.obstacles.entries()) {
            if (coord.distanceTo(position) <= radius) {
                return type;
            }
        }
        return false;
    }

    getObjectsList() {
        return this.objectList;
    }

    changeColor(obj, newColor) {
        if (obj.material !== undefined) {
            if (obj.material.color === undefined || obj.material.color === null) {
                obj.material.uniforms["isPicked"].value = true;
            }
            else{
                obj.material.color = newColor;
            }
        }
        for (let i = 0; i < obj.children.length; i++) {
            this.changeColor(obj.children[i], newColor);
        }
    }

    restoreColor(obj) {
        if (obj.type === 'Mesh' && obj.userData.initialColor !== undefined) {
            if (obj.material.color === undefined || obj.material.color === null) {
                obj.material.uniforms["isPicked"].value = false;
            }
            else {
                obj.material.color = new THREE.Color();
                obj.material.color.r = obj.userData.initialColor.r;
                obj.material.color.g = obj.userData.initialColor.g;
                obj.material.color.b = obj.userData.initialColor.b;
            }
        }
        for (let i = 0; i < obj.children.length; i++) {
            this.restoreColor(obj.children[i]);
        }
    }



    registerInitialColors(obj) {
        if (obj.type === "Mesh") {
            obj.userData.initialColor = new THREE.Color();
            obj.userData.initialMaterial = new THREE.MeshPhongMaterial();
            if (obj.material.color === undefined || obj.material.color === null) {
            }
            else{
                obj.userData.initialColor.r = obj.material.color.r;
                obj.userData.initialColor.g = obj.material.color.g;
                obj.userData.initialColor.b = obj.material.color.b;
            }
        }
        for (let i = 0; i < obj.children.length; i++) {
            this.registerInitialColors(obj.children[i]);
        }
    }

}

export { MyObstacles };
