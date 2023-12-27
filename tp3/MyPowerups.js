import * as THREE from 'three';

class MyPowerups {

    constructor(app) {
        this.app = app;
        this.powerupNodes = {};
        this.powerups = new Map();
        this.objectList = [];
        this.init();
    }
    init() {
        for (let type of ['speedRamps', 'clocks']) {
            this.powerupNodes[type] = this.dfs(this.app.scene.children[3], type)
            for (let i = 0; i < this.powerupNodes[type].children.length; i++) {
                const child = this.powerupNodes[type].children[i];
                this.powerups.set(new THREE.Vector3(child.position.x, child.position.y, child.position.z), type.slice(0, -1));
                this.objectList.push(child.children[0].children[0]);
            }
        }
        /* for (let [coord, type] of this.powerups.entries()) {
            console.log(coord, type);
        } */
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
        for (let [coord, type] of this.powerups.entries()) {
            if (coord.distanceTo(position) <= radius) {
                return type;
            }
        }
        return false;
    }
    getObjectsList() {
        return this.objectList;
    }
}

export { MyPowerups };
