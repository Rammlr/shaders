#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

/* UTILITY FUNCTIONS */
float rectangle_outline(in vec2 st, in vec2 bl, in vec2 tr, in float border_thickness) {
    float smoothness = 0.00;

    // bottom-left
    vec2 blv = smoothstep(bl - smoothness, bl + smoothness, st);
    float pct = blv.x * blv.y;

    // top-right
    vec2 trv = 1. - smoothstep(tr - smoothness, tr + smoothness, st);
    pct *= trv.x * trv.y;

    vec2 blv_inside = smoothstep(bl + border_thickness - smoothness, bl + border_thickness + smoothness, st);
    vec2 trv_inside = 1. - smoothstep(tr - border_thickness - smoothness, tr - border_thickness + smoothness, st);
    float inside = blv_inside.x * trv_inside.x * blv_inside.y * trv_inside.y;

    pct *= 1. - inside;

    return pct;
}

mat2 scale(vec2 _scale) {
    return mat2(_scale.x, 0.0, 0.0, _scale.y);
}

mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

float box(in vec2 _st, in vec2 _size) {
    _size = vec2(0.5) - _size * 0.5;
    vec2 uv = smoothstep(_size, _size + vec2(0.001), _st);
    uv *= smoothstep(_size, _size + vec2(0.001), vec2(1.0) - _st);
    return uv.x * uv.y;
}

float cross(in vec2 _st, float _size) {
    return box(_st, vec2(_size, _size / 5.)) +
        box(_st, vec2(_size / 5., _size));
}

float circle_outline(in vec2 _st, in float _radius) {
    vec2 distance_to_center = _st - vec2(0.5);
    float border_thickness = 0.005;
    float smoothness = 0.001;
    float inner_radius = _radius - border_thickness;

    float inside_outer_circle = 1. - smoothstep(_radius - smoothness, _radius + smoothness, dot(distance_to_center, distance_to_center) * 4.0);
    float inside_inner_circle = smoothstep(inner_radius - smoothness, inner_radius + smoothness, dot(distance_to_center, distance_to_center) * 4.0);
    return inside_inner_circle * inside_outer_circle;
}

vec3 addWaves(in vec3 color, in float distance_to_circle) {
    float some_kinda_amplitude = .5;
    return color * .3 + color * some_kinda_amplitude * sin(50. * distance_to_circle - 20. * u_time);
}

/* NORMAL FUNCTIONS */
vec3 draw_outer_rectangle(in vec2 st, in vec3 rectangle_color, float brightness_modulation) {
    return rectangle_color * brightness_modulation *
        rectangle_outline(st, vec2(.05), vec2(.95), 0.008);
}

vec3 draw_cross(in vec2 st) {
    vec3 cross_color = vec3(1.);
    return cross_color * cross(st, .04);
}

vec3 draw_circle(in vec2 st, in vec3 circle_color, float brightness_modulation) {
    return circle_color * brightness_modulation * circle_outline(st, .025);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    vec3 color = vec3(0.0);
    vec3 teal_color = vec3(0.13, 0.55, 0.93);

    float speed = 1.5;
    float brightness_modulation_sin = abs(sin(u_time * speed)) / 2. + .3;
    float brightness_modulation_cos = abs(cos(u_time * speed)) / 2. + .3;

    color += draw_outer_rectangle(st, teal_color, brightness_modulation_sin);
    color += draw_cross(st);
    color += draw_circle(st, teal_color, brightness_modulation_cos);

    // using mouse y as center also yields some cool results here
    vec2 center = vec2(.5);
    float distance_to_center = distance(st, vec2(st.x, center.y));

    // optional color visualizer (looks cool with higher wave amplitude)
    color += vec3(st.x, st.y, 0);

    vec3 wave_color = vec3(0.23);
    color += addWaves(wave_color, distance_to_center);

    gl_FragColor = vec4(color, 1.0);
}