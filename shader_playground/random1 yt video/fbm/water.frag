#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
        43758.5453123);
}

float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
        (c - a) * u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;
}

#define OCTAVES 7
float fbm_original(in vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;

    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

float fbm(in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float pattern(in vec2 p, out vec2 q, out vec2 r) {
    q.x = fbm(p + vec2(3.0, 7.0 * u_time));
    q.y = fbm(p + vec2(5.2, 1.3 * u_time));

    r.x = fbm(p + 2.0 * q + vec2(1.7, 5.2 * u_time));
    r.y = fbm(p + 10.0 * q + vec2(8.3, 2.8 * u_time));

    return fbm(p + 4.0 * r);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= 3.;

    vec2 q, r;

    vec3 color = vec3(0.0);
    float f = pattern(st * 5., q, r);

    color = mix(vec3(0.101961, 0.619608, 0.666667), vec3(0.2275, 0.5059, 0.9216), clamp(f, 0.0, 1.0));

    color = mix(color, vec3(0.1255, 0.451, 0.8196), clamp(length(q), 0.0, 1.0));

    color = mix(color, vec3(0.1882, 0.8471, 0.9608), clamp(length(r.x), 0.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
}
