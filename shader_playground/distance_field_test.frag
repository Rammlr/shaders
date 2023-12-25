#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float sdfCircle(in vec2 p, in float r) {
    return length(p) - r;
}

vec3 getColor(in float distance_to_circle) {
    vec3 outside_color = vec3(0.31, 0.77, 0.73);
    vec3 inside_color = vec3(0.93, 0.57, 0.03);

    return mix(inside_color, outside_color, step(0., distance_to_circle));
}

vec3 addShadow(in vec3 color, in float distance_to_circle) {
    return color * (1. - exp(-10. * abs(distance_to_circle)));
}

vec3 addWaves(in vec3 color, in float distance_to_circle) {
    return color * .8 + color * .2 * sin(300. * distance_to_circle -  10. * u_time);
}

vec3 addWhiteOutline(in vec3 color, in float distance_to_circle) {
    vec3 white = vec3(1.);
    return mix(white, color, 10. * abs(distance_to_circle));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st *= 2.;
    st -= 1.;
    vec2 center = (u_mouse/u_resolution.xy) * 2. - 1.;
    // vec2 center = vec2(0.);
    float radius = .4;

    float distance_to_circle = sdfCircle(st - center, radius);

    vec3 color = getColor(distance_to_circle);
    color = addShadow(color, distance_to_circle);    
    color = addWaves(color, distance_to_circle);
    // color = addWhiteOutline(color, distance_to_circle);

    gl_FragColor = vec4(color, 1.0);
}