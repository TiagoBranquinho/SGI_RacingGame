import * as THREE from 'three';

class MyObstacles {

    constructor(app) {
        this.app = app;
        this.obstacleNodes = {};
        this.obstacles = new Map();
        this.objectList = [];
        this.init();
    }
    init() {
        for (let type of ['cones', 'barrels']) {
            this.obstacleNodes[type] = this.dfs(this.app.scene.children[4], type)
        }
        this.update();



    }

    gato() {
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
            obj.material.color = newColor;
        }
        for (let i = 0; i < obj.children.length; i++) {
            this.changeColor(obj.children[i], newColor);
        }
    }

    restoreColor(obj) {
        if (obj.type === 'Mesh') {
            obj.material.color = new THREE.Color();
            obj.material.color.r = obj.userData.initialColor.r;
            obj.material.color.g = obj.userData.initialColor.g;
            obj.material.color.b = obj.userData.initialColor.b;
        }
        for (let i = 0; i < obj.children.length; i++) {
            this.restoreColor(obj.children[i]);
        }
    }



    registerInitialColors(obj) {
        if (obj.type === "Mesh") {
            obj.userData.initialColor = new THREE.Color();
            obj.userData.initialColor.r = obj.material.color.r;
            obj.userData.initialColor.g = obj.material.color.g;
            obj.userData.initialColor.b = obj.material.color.b;
        }
        for (let i = 0; i < obj.children.length; i++) {
            this.registerInitialColors(obj.children[i]);
        }
    }

}

export { MyObstacles };
