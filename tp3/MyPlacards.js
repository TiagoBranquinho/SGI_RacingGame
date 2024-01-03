import * as THREE from 'three';
import { MyTextRenderer } from './MyTextRenderer.js';

class MyPlacards {
    constructor(app) {
        this.app = app;
        this.placards = [];
        this.renderer = new MyTextRenderer(app);
    }

    init() {
        let outerGroup = new THREE.Group();
        outerGroup.name = "placards";
        outerGroup.add(this.createPlacard(new THREE.Vector3(50, 4, 18), - Math.PI / 12));
        outerGroup.add(this.createPlacard(new THREE.Vector3(220, 4, -135), Math.PI / 12));
        outerGroup.add(this.createPlacard(new THREE.Vector3(-30, 4, 65), Math.PI / 12 - Math.PI));
        outerGroup.add(this.createPlacard(new THREE.Vector3(-150, 4, 250), -Math.PI / 2 - Math.PI / 3));
        outerGroup.add(this.createPlacard(new THREE.Vector3(-170, 4, -18), Math.PI / 2));
        this.app.scene.add(outerGroup);
    }

    createPlacard(coords, rotation) {
        let placard = new THREE.Group();
        placard.name = "placard";
        let pole = this.createPole();
        let screen = this.createScreen();
        placard.add(pole);
        pole.add(screen);
        placard.position.set(coords.x, coords.y, coords.z);
        placard.rotation.y = rotation;
        return placard;
    }

    createPole() {
        let pole = new THREE.Group();
        pole.name = "pole";

        let base = this.createBase();
        pole.add(base);

        let verticalPole = this.createVerticalPole();
        pole.add(verticalPole);

        let horizontalPole = this.createHorizontalPole();
        pole.add(horizontalPole);
        this.placards.push(pole);
        return pole;
    }

    createVerticalPole() {
        let poleBase = new THREE.Group();
        poleBase.name = "poleBase";

        let poleBaseMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 100 });
        let poleBaseGeometry = new THREE.BoxGeometry(0.5, 8, 0.5);
        let poleBaseMesh = new THREE.Mesh(poleBaseGeometry, poleBaseMaterial);
        poleBase.add(poleBaseMesh);

        return poleBase;
    }

    createBase() {
        let base = new THREE.Group();
        base.name = "base";

        let baseMaterial = new THREE.MeshPhongMaterial({ color: 0xdedede, shininess: 100 });
        let baseGeometry = new THREE.BoxGeometry(3, 0.2, 3);
        let baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
        baseMesh.position.set(0, -4, 0);
        base.add(baseMesh);

        return base;
    }

    createHorizontalPole() {
        let horizontalPole = new THREE.Group();
        horizontalPole.name = "horizontalPole";

        let horizontalPoleMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 100 });
        let horizontalPoleGeometry = new THREE.BoxGeometry(0.2, 1.6, 0.2); // Adjust dimensions for the horizontal pole
        let horizontalPoleMesh = new THREE.Mesh(horizontalPoleGeometry, horizontalPoleMaterial);
        horizontalPoleMesh.position.set(-0.5, 4, 0); // Adjust the height to connect to the top of the main pole
        horizontalPoleMesh.rotation.z = 2 * Math.PI / 5; // Rotate the horizontal pole to be perpendicular to the main pole
        horizontalPole.add(horizontalPoleMesh);

        return horizontalPole;
    }

    createScreen() {
        let screen = new THREE.Group();
        screen.name = "screen";

        let screenMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 100 });
        let screenGeometry = new THREE.BoxGeometry(8, 0.3, 16); // Adjust dimensions for the screen
        let screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);

        screen.add(screenMesh);
        let textGroup = new THREE.Group();
        textGroup.name = "textGroup";
        textGroup.position.set(6, 2.5, -5);
        textGroup.rotation.z = Math.PI / 2;

        screen.add(textGroup);
        screen.rotation.z = Math.PI / 2 - Math.PI / 24; // Rotate the screen to be perpendicular to the main pole
        screenMesh.position.set(4, 1.8, 0); // Position the screen parallel to the ground



        return screen;
    }

    updateDisplayText(placard, info) {
        let screen = placard.getObjectByName("screen");
        let textGroup = screen.getObjectByName("textGroup");

        for (let i = 0; i < textGroup.children.length; i++) {
            textGroup.remove(textGroup.children[i]);
        }
        for (let i = 0; i < info.length; i++) {
            let newText = this.renderer.renderText(info[i], 1);
            newText.position.set(0, 1.2 * i, 0);
            textGroup.add(newText);
        }
    }

    update(player, track) {
        let info = [];
        let firstLine = "lap " + player.lapCount + "/" + track.laps + " " + player.currentTime + "s";
        info.push(firstLine);
        let secondLine = (player.handler.velocity * 100).toFixed(2) + "/" + (player.handler.maxSpeed * 100).toFixed(2) + "km/h";
        info.push(secondLine);
        for (let key in player.state) {
            if (player.state[key]) {
                info.push(key + player.timers[key] + "s");
            }
        }
        for (let i = 0; i < this.placards.length; i++) {
            let placard = this.placards[i];
            this.updateDisplayText(placard, info);
        }
    }

    // Add your renderText function here for rendering text on the screen

}

export { MyPlacards };
