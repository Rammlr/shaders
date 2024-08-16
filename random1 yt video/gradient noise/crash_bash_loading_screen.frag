#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)), dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x), mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

vec3 distance_field(vec2 st) {
    vec2 pos = vec2(st);
    // pos += noise(pos * (5. + 3. * noise(vec2(u_time))));

    float pct = distance(pos, vec2(.55, 0.6));
    pct = sqrt(pct);

    vec3 green = vec3(.02, .5, .35);
    vec3 blue = vec3(.02, .3, .6);

    float green_bias = .4;
    return mix(blue * pct, green * pct, noise(pos * 3.) + green_bias);
}

mat2 rotate2d(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    vec3 color = vec3(0.0);

    color = distance_field(st);

    // pos in -.5 - .5 range
    vec2 pos = vec2(0.5) - st;
    float zoom = 20.;
    float r = distance(pos, vec2(.55, 0.6)) * zoom;
    float a = atan(pos.y, pos.x) * zoom;
    pos *= zoom;
    pos = rotate2d(noise(u_mouse)) * pos;

    float noise_strength = .2;
    float radial_coords_noise = abs(noise(vec2(pos.x, pos.y)) * noise_strength);
    color += vec3(radial_coords_noise);

    gl_FragColor = vec4(color, 1.0);
}
