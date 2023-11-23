import * as THREE from 'three';
import { MyTriangle } from './MyTriangle.js';

export class MyPolygon extends THREE.BufferGeometry {
    radius = 0;
    innerColor = 0;
    outterColor = 0;
    constructor(radius, stacks, slices, color_c, color_p) {
        super();
        this.radius = radius;
        this.innerColor = color_c;
        this.outterColor = color_p;
        // Calculate the angle between each slice
        const angleIncrement = (2 * Math.PI) / slices;

        // Arrays to store vertices, normals, uvs, and colors
        let vertices = [];
        let normals = [];
        let uvs = [];
        let colors = [];


        for (let slice = 0; slice < slices; slice++) {
            const currAngle = angleIncrement * slice;
            const nextAngle = angleIncrement * (slice + 1);

            let outerPoint1 = [Math.cos(currAngle), Math.sin(currAngle), 0];
            let outerPoint2 = [Math.cos(nextAngle), Math.sin(nextAngle), 0];

            for (let stack = 0; stack < stacks; stack++) {
                // Define heights for each stack
                const currHeight = radius * (stack / stacks);
                const nextHeight = radius * ((stack + 1) / stacks);

                // Define points for triangles
                const point1 = outerPoint1.map((coord) => coord * currHeight);
                const point2 = outerPoint1.map((coord) => coord * nextHeight);
                const point3 = outerPoint2.map((coord) => coord * nextHeight);

                // Create first triangle
                const triangle = new MyTriangle(point1, point2, point3);

                // Add triangle vertices, normals, and uvs to the arrays
                vertices.push(...triangle.getAttribute('position').array);
                normals.push(...triangle.getAttribute('normal').array);
                uvs.push(...triangle.getAttribute('uv').array);

                // Compute color based on distance from center
                const color1 = this.pointColorScale(point1)
                console.log(color1)
                const color2 = this.pointColorScale(point2)
                const color3 = this.pointColorScale(point3)

                // Add color for each vertex of the triangle
                colors.push(color1.r, color1.g, color1.b); // Vertex 1
                colors.push(color2.r, color2.g, color2.b); // Vertex 2
                colors.push(color3.r, color3.g, color3.b); // Vertex 4

                // now there's only the need to create 1 point for each stack
                if (stack != 0) {
                    const point4 = outerPoint2.map((coord) => coord * currHeight);
                    const triangle2 = new MyTriangle(point1, point3, point4);
                    vertices.push(...triangle2.getAttribute('position').array);
                    normals.push(...triangle2.getAttribute('normal').array);
                    uvs.push(...triangle2.getAttribute('uv').array);

                    const color4 = this.pointColorScale(point4)

                    // Add color for each vertex of the second triangle
                    colors.push(color1.r, color1.g, color1.b); // Vertex 1
                    colors.push(color3.r, color3.g, color3.b); // Vertex 3
                    colors.push(color4.r, color4.g, color4.b); // Vertex 4

                }
            }
        }

        // Set the geometry attributes
        this.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        this.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    }

    pointColorScale(point) {
        const distance = Math.sqrt(point[0] ** 2 + point[1] ** 2 + point[2] ** 2);
        const normalizedDistance = distance / this.radius;
        return new THREE.Color(this.innerColor).lerp(new THREE.Color(this.outterColor), normalizedDistance);
    };

}
