import * as THREE from 'three';

class MyParkedCars {

    constructor(app) {
        this.app = app;
        this.carNodes = {};
        this.carList = [];
        this.playerCarList = [];
        this.botCarList = [];
        this.init();
    }
    init() {
        for (let type of ['playersCars', 'botsCars']) {
            this.carNodes[type] = this.dfs(this.app.scene.children[6], type)
        }
        this.update();
    }

    gato() {
        for (let i = 0; i < this.carList.length; i++) {
            this.registerInitialColors(this.carList[i])
        }
    }

    update() {
        for (let type of ['playersCars', 'botsCars']) {
            for (let i = 0; i < this.carNodes[type].children.length; i++) {
                const child = this.carNodes[type].children[i];
                if (type === 'playersCars') {
                    this.playerCarList.push(child);
                }
                else {
                    this.botCarList.push(child);
                }
                this.carList.push(child);
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

    getCarsList() {
        return this.carList;
    }

    isPlayerCar(car) {
        return this.playerCarList.includes(car);
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
        if (obj.type === 'Mesh' && obj.userData.initialColor !== undefined) {
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
            if(obj.userData.initialColor === undefined || obj.userData.initialColor === null){
                obj.userData.initialColor = new THREE.Color();
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

export { MyParkedCars };
