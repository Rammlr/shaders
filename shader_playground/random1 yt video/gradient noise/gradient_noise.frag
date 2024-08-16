#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

vec2 time_random2(vec2 st) {
    st = vec2(dot(st, vec2(sin(127.1 * u_time), cos(311.7 * u_time))), dot(st, vec2(sin(u_time * 269.5), cos(u_time * 183.3))));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123 * u_time);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)), dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x), mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float time_noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(dot(time_random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)), dot(time_random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x), mix(dot(time_random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(time_random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(st * 10.0);

    color = vec3(noise(pos) * .5 + .5);
    // color = vec3(time_noise(pos) * .5 + .5);

    gl_FragColor = vec4(color, 1.0);
}
