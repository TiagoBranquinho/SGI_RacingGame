import * as THREE from 'three';
import { MyTriangle } from './MyTriangle.js';

export class MyPolygon extends THREE.BufferGeometry {
    constructor(radius, stacks, slices, centerColor, periphericColor) {
        super();

        // Calculate the angle between each slice
        const angleStep = (Math.PI * 2) / slices;

        // Arrays to store vertices, normals, uvs, and colors
        let vertices = [];
        let normals = [];
        let uvs = [];
        let colors = [];

        // Helper function to calculate normalized distance from center
        const calculateNormalizedDistance = (vertex) => {
            const distance = Math.sqrt(vertex[0] * vertex[0] + vertex[1] * vertex[1]);
            return distance / radius;
        };

        for (let i = 0; i < slices; i++) {
            const angle1 = angleStep * i;
            const angle2 = angleStep * (i + 1);

            // Define points for each slice
            const x1 = radius * Math.cos(angle1);
            const y1 = radius * Math.sin(angle1);
            const x2 = radius * Math.cos(angle2);
            const y2 = radius * Math.sin(angle2);

            for (let j = 0; j < stacks; j++) {
                // Define heights for each stack
                const startHeight = (j / stacks) * radius;
                const endHeight = ((j + 1) / stacks) * radius;

                // Define points for triangles
                const p1 = [x1 * startHeight, y1 * startHeight, 0];
                const p2 = [x1 * endHeight, y1 * endHeight, 0];
                const p4 = [x2 * endHeight, y2 * endHeight, 0];

                // Create first triangle
                const triangle1 = new MyTriangle([p1, p2, p4]);

                // Add triangle vertices, normals, and uvs to the arrays
                vertices.push(...triangle1.getAttribute('position').array);
                normals.push(...triangle1.getAttribute('normal').array);
                uvs.push(...triangle1.getAttribute('uv').array);

                // Compute color based on distance from center
                const color1 = new THREE.Color(centerColor).lerp(new THREE.Color(periphericColor), calculateNormalizedDistance(p1));
                const color2 = new THREE.Color(centerColor).lerp(new THREE.Color(periphericColor), calculateNormalizedDistance(p2));
                const color4 = new THREE.Color(centerColor).lerp(new THREE.Color(periphericColor), calculateNormalizedDistance(p4));

                // Add color for each vertex of the triangle
                colors.push(color1.r, color1.g, color1.b); // Vertex 1
                colors.push(color2.r, color2.g, color2.b); // Vertex 2
                colors.push(color4.r, color4.g, color4.b); // Vertex 4

                if (j > 0) {
                    const p3 = [x2 * startHeight, y2 * startHeight, 0];
                    const triangle2 = new MyTriangle([p1, p4, p3]);
                    vertices.push(...triangle2.getAttribute('position').array);
                    normals.push(...triangle2.getAttribute('normal').array);
                    uvs.push(...triangle2.getAttribute('uv').array);

                    const color3 = new THREE.Color(centerColor).lerp(new THREE.Color(periphericColor), calculateNormalizedDistance(p3));

                    // Add color for each vertex of the second triangle
                    colors.push(color1.r, color1.g, color1.b); // Vertex 1
                    colors.push(color4.r, color4.g, color4.b); // Vertex 4
                    colors.push(color3.r, color3.g, color3.b); // Vertex 3
                }
            }
        }

        // Set the geometry attributes
        this.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        this.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        this.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    }
}
