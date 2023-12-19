import * as THREE from 'three';

class MyEventHandler {
    constructor(contents, intersectObjects) {
        this.contents = contents;
        this.intersectObjects = intersectObjects;
        this.init();
        this.moveListener();
    }
    init() {
        this.pointer = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 20
        this.lastPickedObj = null
        this.pickingColor = 0x00ff00
    }
    moveListener() {
        document.addEventListener(
            "pointermove",
            this.onPointerMove.bind(this),
            false
        );
    }
    onPointerMove(event) {

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.contents.app.activeCamera);

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(this.intersectObjects);

        this.pickingHelper(intersects)

        this.transverseRaycastProperties(intersects)
    }

    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object
            this.changeColorOfFirstPickedObj(obj)
        } else {
            this.restoreColorOfFirstPickedObj()
        }
    }

    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
            this.lastPickedObj = obj;
            this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
            this.lastPickedObj.material.color.setHex(this.pickingColor);
        }
    }

    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        this.lastPickedObj = null;
    }

    transverseRaycastProperties(intersects) {
        for (var i = 0; i < intersects.length; i++) {

            console.log(intersects[i]);

            /*
            An intersection has the following properties :
                - object : intersected object (THREE.Mesh)
                - distance : distance from camera to intersection (number)
                - face : intersected face (THREE.Face3)
                - faceIndex : intersected face index (number)
                - point : intersection point (THREE.Vector3)
                - uv : intersection point in the object's UV coordinates (THREE.Vector2)
            */
        }
    }

}
export { MyEventHandler };
