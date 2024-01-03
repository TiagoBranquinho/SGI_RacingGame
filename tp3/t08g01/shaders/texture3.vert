varying vec2 vUv;
varying vec3 vNormal;

uniform float normScale;
uniform float normalizationFactor;
uniform float displacement;
uniform sampler2D uSampler2;
uniform float timeFactor;

void main() {
    vNormal = normal;
    vUv = uv;

    // Sample the texture
    vec4 texColor = texture2D(uSampler2, vUv);

    // Convert the color to grayscale
    float grayScale = texColor.r;

    // Displace the position in the direction of the normal
    vec3 displacedPosition = position + normal * normalizationFactor * (displacement + normScale * grayScale);

    vec4 modelViewPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
}