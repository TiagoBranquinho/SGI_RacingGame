import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyCarocha {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app

        // table related attributes
        this.frameMesh = null;
        this.frameSize = 1.0;
        this.frameEnabled = true;
        this.lastFrameEnabled = null;
        this.frameDisplacement = new THREE.Vector3(0, 0, 0);

    }

    buildCarocha() {
        let frameMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513, // Brown color
            specular: 0x000000,
            emissive: 0x000000,
            shininess: 40
        });

        let frameWidth = 6;
        let frameHeight = 3;
        let frameDepth = 0.2;

        let frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, frameDepth);
        this.frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);

        this.frameMesh.position.set(0, 3, 10)
        this.frameMesh.rotation.y = Math.PI

        let textureLoader = new THREE.TextureLoader();
        let viewTexture = textureLoader.load('textures/white.avif');

        let viewMaterial = new THREE.MeshPhongMaterial({
            map: viewTexture,
            color: 0x8C8C8C,
            specular: 0x8C8C8C,
            emissive: 0x000000,
            shininess: 40
        });

        let viewWidth = frameWidth - 0.1; // Adjust the size of the photo to fit inside the frame
        let viewHeight = frameHeight - 0.1;
        
        let viewGeometry = new THREE.PlaneGeometry(viewWidth, viewHeight);
        
        this.viewMesh = new THREE.Mesh(viewGeometry, viewMaterial);
        
        // Position the photo within the frame
        this.viewMesh.position.set(0, 0, frameDepth / 2 + 0.01); // Slightly in front of the frame

        this.frameMesh.add(this.viewMesh);

        this.numberOfSamples = 16;

        // Create the silhouette of a "carocha"
        this.carochaMesh = new THREE.Group();

        let pointsWheel1 = [
            new THREE.Vector3(-0.6, -0.6, 0.0), // starting point
            new THREE.Vector3(-0.6, 0.3, 0.0),
            new THREE.Vector3(0.6, 0.3, 0.0),
            new THREE.Vector3(0.6, -0.6, 0.0)  // ending point
        ]
    
        let positionWheel1 = new THREE.Vector3(-1, -0.6, frameDepth / 2 + 0.01)
        this.drawHull(positionWheel1, pointsWheel1);
    
        let curveWheel1 = new THREE.CubicBezierCurve3(pointsWheel1[0], pointsWheel1[1], pointsWheel1[2], pointsWheel1[3])
    
        // sample a number of points on the curve
        let sampledPointsWheel1 = curveWheel1.getPoints(this.numberOfSamples);
    
        this.curveGeometryWheel1 = new THREE.BufferGeometry().setFromPoints(sampledPointsWheel1)
        this.lineMaterial = new THREE.LineBasicMaterial({color: 0x000000})
        this.lineObjWheel1 = new THREE.Line(this.curveGeometryWheel1, this.lineMaterial)
        this.lineObjWheel1.position.set(positionWheel1.x,positionWheel1.y,positionWheel1.z)
        this.carochaMesh.add(this.lineObjWheel1);

        let pointsWheel2 = [
            new THREE.Vector3(-0.6, -0.6, 0.0), // starting point
            new THREE.Vector3(-0.6, 0.3, 0.0),
            new THREE.Vector3(0.6, 0.3, 0.0),
            new THREE.Vector3(0.6, -0.6, 0.0)  // ending point
        ]
    
        let positionWheel2 = new THREE.Vector3(1, -0.6, frameDepth / 2 + 0.01)
        this.drawHull(positionWheel2, pointsWheel2);
    
        let curveWheel2 = new THREE.CubicBezierCurve3(pointsWheel2[0], pointsWheel2[1], pointsWheel2[2], pointsWheel2[3])
    
        // sample a number of points on the curve
        let sampledPointsWheel2 = curveWheel2.getPoints(this.numberOfSamples);
    
        this.curveGeometryWheel2 = new THREE.BufferGeometry().setFromPoints(sampledPointsWheel2)
        this.lineMaterial = new THREE.LineBasicMaterial({color: 0x000000})
        this.lineObjWheel2 = new THREE.Line(this.curveGeometryWheel2, this.lineMaterial)
        this.lineObjWheel2.position.set(positionWheel2.x,positionWheel2.y,positionWheel2.z)
        this.carochaMesh.add(this.lineObjWheel2);


        let pointsBody = [
            new THREE.Vector3(-0.6, -0.6, 0.0), // starting point
            new THREE.Vector3(-0.4, 1.6, 0.0),
            new THREE.Vector3(1.9, 1.6, 0.0),
            new THREE.Vector3(1.9, 0.4, 0.0)  // ending point
        ]
        
        let positionBody = new THREE.Vector3(-1, -0.6, frameDepth / 2 + 0.01)
        this.drawHull(positionBody, pointsBody);
    
        let curveBody = new THREE.CubicBezierCurve3(pointsBody[0], pointsBody[1], pointsBody[2], pointsBody[3])
    
        // sample a number of points on the curve
        let sampledPointsBody = curveBody.getPoints(this.numberOfSamples);
    
        this.curveGeometryBody = new THREE.BufferGeometry().setFromPoints(sampledPointsBody)
        this.lineMaterial = new THREE.LineBasicMaterial({color: 0x000000})
        this.lineObjBody = new THREE.Line(this.curveGeometryBody, this.lineMaterial)
        this.lineObjBody.position.set(positionBody.x,positionBody.y,positionBody.z)
        this.carochaMesh.add(this.lineObjBody);

        let pointsFront = [
            new THREE.Vector3(1.9, 0.4, 0.0), // starting point
            new THREE.Vector3(1.9, 0.4, 0.0),
            new THREE.Vector3(2.6, 0.4, 0.0),
            new THREE.Vector3(2.6, -0.6, 0.0)  // ending point
        ]
        
        let positionFront = new THREE.Vector3(-1, -0.6, frameDepth / 2 + 0.01)
        this.drawHull(positionFront, pointsFront);
    
        let curveFront = new THREE.CubicBezierCurve3(pointsFront[0], pointsFront[1], pointsFront[2], pointsFront[3])
    
        // sample a number of points on the curve
        let sampledPointsFront = curveFront.getPoints(this.numberOfSamples);
    
        this.curveGeometryFront = new THREE.BufferGeometry().setFromPoints(sampledPointsFront)
        this.lineMaterial = new THREE.LineBasicMaterial({color: 0x000000})
        this.lineObjFront = new THREE.Line(this.curveGeometryFront, this.lineMaterial)
        this.lineObjFront.position.set(positionFront.x,positionFront.y,positionFront.z)
        this.carochaMesh.add(this.lineObjFront);

        this.frameMesh.add(this.carochaMesh);

        this.frameMesh.rotation.y = Math.PI
    }

    drawHull(position, points) {  
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        let line = new THREE.Line(geometry, this.hullMaterial);

        // set initial position
        line.position.set(position.x,position.y,position.z)
        this.app.scene.add(line);

    }


    /**
     * initializes the contents
     */
    init() {

        this.buildCarocha();
    }

}

export { MyCarocha };