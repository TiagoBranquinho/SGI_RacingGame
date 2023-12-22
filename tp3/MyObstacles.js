import * as THREE from 'three';

class MyObstacles {

    constructor(app) {
        this.app = app;
        this.obstacleNodes = {};
        this.obstacles = new Map();
        this.init();
    }
    init() {
        console.log(this.app.scene.children[4])
        for (let type of ['cones', 'barrels']) {
            this.obstacleNodes[type] = this.dfs(this.app.scene.children[4], type)
            for (let i = 0; i < this.obstacleNodes[type].children.length; i++) {
                const child = this.obstacleNodes[type].children[i];
                this.obstacles.set(new THREE.Vector3(child.position.x, child.position.y, child.position.z), type.slice(0, -1));
            }
        }
        //console log this.obstacles
        for (let [coord, type] of this.obstacles.entries()) {
            console.log(coord, type);
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

}

export { MyObstacles };
