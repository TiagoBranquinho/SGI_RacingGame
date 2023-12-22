import * as THREE from 'three';

class MyObstacles {

    constructor(app) {
        this.app = app;
        this.obstacles = {};
        this.init();
    }
    init() {
        console.log(this.app.scene.children[4])
        for(let type of ['cones']){
            this.obstacles[type] = this.dfs(this.app.scene.children[4], type)
            console.log(this.obstacles[type])
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
