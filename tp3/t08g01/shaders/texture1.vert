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
    vec4 texColor = texture2D(uSampler2, uv);

    // Convert the color to grayscale
    float grayScale = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

    // Create a pulse effect by modulating the displacement with a sine function
    float pulse = sin(2.0 * 3.14159 * timeFactor);

    // Displace the position in the direction of the normal
    vec3 displacedPosition = position + normal * normalizationFactor * (displacement + normScale * grayScale * pulse);

    vec4 modelViewPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
}