import * as THREE from 'three'

class MyFirework {

    constructor(app, scene) {
        this.app = app
        this.scene = scene

        this.done     = false 
        this.dest     = []
        this.destExploded = [] 
        
        this.vertices = null
        this.colors   = null
        this.geometry = null
        this.geometrySphere = null
        this.points   = null
        this.pointsExploded = null
        
        this.material = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })
        
        this.height = 120
        this.speed = 60

        this.launch() 

    }

    /**
     * compute particle launch
     */

    launch() {
        let color = new THREE.Color()
        color.setHSL( THREE.MathUtils.randFloat( 0.1, 0.9 ), 1, 0.9 )
        let colors = [ color.r, color.g, color.b ]

        let x = THREE.MathUtils.randFloat( -50, 50 ) 
        let y = THREE.MathUtils.randFloat( this.height * 0.9, this.height * 1.1)
        let z = THREE.MathUtils.randFloat( 150, 250 ) 
        this.dest.push( x, y, z ) 
        let vertices = [0,0,200]
        
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) );
        this.geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
        this.points = new THREE.Points( this.geometry, this.material )
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.app.scene.add( this.points )  
    }

    /**
     * compute explosion
     * @param {*} vector 
     */
    explode(origin, n, rangeBegin, rangeEnd) {
        // Remove the original particle
        this.app.scene.remove(this.points);
        this.points.geometry.dispose();
    
        // Create new particles
        let vertices = [];
        let colors = [];
        for (let i = 0; i < n; i++) {
            // Create a random spherical coordinate
            let radius = 500;
            let theta = THREE.MathUtils.randFloat(0, Math.PI * 2); // azimuthal angle
            let phi = Math.acos(1 - 2 * Math.random()); // polar angle

            // Convert spherical coordinate to Cartesian coordinate
            let direction = new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta), // x
                radius * Math.sin(phi) * Math.sin(theta), // y
                radius * Math.cos(phi) // z
            );

            vertices.push(
                origin.x + 1 * Math.sin(phi) * Math.cos(theta), // x
                origin.y + 1 * Math.sin(phi) * Math.sin(theta), // y
                origin.z + 1 * Math.cos(phi) // z
            );
    
            // Add the direction to the origin to get the destination
            let destination = new THREE.Vector3().addVectors(new THREE.Vector3(origin.x + 1 * Math.sin(phi) * Math.cos(theta), origin.y + 1 * Math.sin(phi) * Math.sin(theta), origin.z + 1 * Math.cos(phi)), direction);
    
            // Add the destination to the vertices
            this.destExploded.push(destination.x, destination.y, destination.z);


    
            // Create a random color for the particle
            let color = new THREE.Color();
            color.setHSL(THREE.MathUtils.randFloat(0, 1), 1, THREE.MathUtils.randFloat(0.5, 1));
            colors.push(color.r, color.g, color.b);
        }
    
        // Create a new geometry for the particles
        this.geometrySphere = new THREE.BufferGeometry();
        this.geometrySphere.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.geometrySphere.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
        // Create a new points object for the particles
        this.pointsExploded = new THREE.Points(this.geometrySphere, this.material);
        this.pointsExploded.castShadow = true;
        this.pointsExploded.receiveShadow = true;
        this.app.scene.add(this.pointsExploded);
    }
    
    /**
     * cleanup
     */
    reset() {
        this.app.scene.remove( this.points ) 
        this.dest     = [] 
        this.vertices = null
        this.colors   = null 
        this.geometry = null
        this.points   = null
    }

    resetExploded() {
        this.app.scene.remove( this.pointsExploded ) 
        this.destExploded = []
        this.geometrySphere = null
        this.pointsExploded = null
    }

    /**
     * update firework
     * @returns 
     */
    update() {
        
        // do only if objects exist
        if( this.points && this.geometry )
        {
            let verticesAtribute = this.geometry.getAttribute( 'position' )
            let vertices = verticesAtribute.array
            let count = verticesAtribute.count

            // lerp particle positions 
            let j = 0
            for( let i = 0; i < vertices.length; i+=3 ) {
                vertices[i  ] += ( this.dest[i  ] - vertices[i  ] ) / this.speed
                vertices[i+1] += ( this.dest[i+1] - vertices[i+1] ) / this.speed
                vertices[i+2] += ( this.dest[i+2] - vertices[i+2] ) / this.speed
            }
            verticesAtribute.needsUpdate = true
            
            // only one particle?
            if( count === 1 ) {
                //is YY coordinate higher close to destination YY? 
                if( Math.ceil( vertices[1] ) > ( this.dest[1] * 0.95 ) ) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    let origin = new THREE.Vector3(vertices[0], vertices[1], vertices[2]);
                    this.explode(origin, 500, this.height * 0.05, this.height * 0.8) 
                }
            }
            
            // are there a lot of particles (aka already exploded)?
            else if( count > 1 ) {
                // fade out exploded particles 
                this.material.opacity -= 0.015 
                this.material.needsUpdate = true
            }
            
            // remove, reset and stop animating 
            if( this.material.opacity <= 0 )
            {
                this.reset() 
                this.done = true 
            }
        }

        // do only if objects exist
        if( this.pointsExploded && this.geometrySphere )
        {
            let verticesAtribute = this.geometrySphere.getAttribute( 'position' )
            let vertices = verticesAtribute.array
            let count = verticesAtribute.count

            // lerp particle positions 
            let j = 0
            for( let i = 0; i < vertices.length; i+=3 ) {
                vertices[i  ] += ( this.destExploded[i  ] - vertices[i  ] ) / this.speed
                vertices[i+1] += ( this.destExploded[i+1] - vertices[i+1] ) / this.speed
                vertices[i+2] += ( this.destExploded[i+2] - vertices[i+2] ) / this.speed
            }
            verticesAtribute.needsUpdate = true

            // only one particle?
            if( count === 1 ) {
                //is YY coordinate higher close to destination YY? 
                if( Math.ceil( vertices[1] ) > ( this.destExploded[1] * 0.95 ) ) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    this.app.scene.remove(this.pointsExploded);
                    this.pointsExploded.geometry.dispose();
                }
            }
            
            // are there a lot of particles (aka already exploded)?
            else if( count > 1 ) {
                // fade out exploded particles 
                this.material.opacity -= 0.015 
                this.material.needsUpdate = true
            }
            
            // remove, reset and stop animating 
            if( this.material.opacity <= 0 )
            {
                this.resetExploded() 
                this.done = true 
            }
        }
    }
}

export { MyFirework }