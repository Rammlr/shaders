#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(float x) {
    return fract(sin(x) * 43758.5453123);
}

float random(vec2 st) {
    return random(dot(st.xy, vec2(1., 1.)));
}

float random_good(vec2 st) {
    return random(dot(st.xy, vec2(12.3232, 89.8989)));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    float rnd = 0.;
    rnd = random(st);
    rnd = random_good(st);

    gl_FragColor = vec4(vec3(rnd), 1.0);
}