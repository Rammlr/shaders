#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(float x) {
    return fract(sin(x) * 100000.0);
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(1., 1.))) * 43758.5453123);
    ;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    float rnd = random(st);

    gl_FragColor = vec4(vec3(rnd), 1.0);
}