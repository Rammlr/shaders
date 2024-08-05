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
    return color * .8 + color * .2 * sin(300. * distance_to_circle - 10. * u_time);
}

vec3 addWhiteOutline(in vec3 color, in float distance_to_circle) {
    vec3 white = vec3(1.);
    return mix(white, color, 10. * abs(distance_to_circle));
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
        43758.5453123);
}

float random(int i) {
    return random(vec2(float(i) + u_time / 4000000.));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    vec3 color = vec3(.0);

    // Cell positions
    const int TOTAL_POINTS = 20;
    vec2 point[TOTAL_POINTS];
    for (int i = 0; i < TOTAL_POINTS; i++) {

        point[i] = vec2(random(i), random(i + TOTAL_POINTS * 40));
    }

    float m_dist = 1.;  // minimum distance

    // Iterate through the points positions
    for (int i = 0; i < 5; i++) {
        float dist = distance(st, point[i]);

        // Keep the closer distance
        m_dist = min(m_dist, dist);
    }

    float distance_to_circle = m_dist - .15;

    color = getColor(distance_to_circle);
    color = addShadow(color, distance_to_circle);
    color = addWaves(color, distance_to_circle);
    // color = addWhiteOutline(color, distance_to_circle);

    gl_FragColor = vec4(color, 1.0);
}