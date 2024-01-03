varying vec2 vUv;

uniform sampler2D uSampler1;
uniform sampler2D uSampler2;
uniform float blendScale;
uniform float timeFactor;
uniform bool isPicked;

float func_mod(float x, float y) {
    return float(x)-float(y)*floor(float(x)/float(y));
}

void main() {
	float t = (timeFactor);	
	vec4 color1 = texture2D(uSampler1, vUv);
	if (!isPicked) {
		vec4 color2 = texture2D(uSampler2, vec2(vUv.x, func_mod(t - vUv.y, 1.0)));
		gl_FragColor = mix(color1, color2, blendScale);
	}
	else{
		gl_FragColor = color1;
	}
}