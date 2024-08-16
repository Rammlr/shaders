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

float rectangle_outline(in vec2 st, in vec2 bl, in vec2 tr) {
    float border_thickness = 0.01;

    // bottom-left
    vec2 blv = step(bl, st);
    float pct = blv.x * blv.y;

    // top-right
    vec2 trv = 1. - step(tr, st);
    pct *= trv.x * trv.y;

    vec2 blv_inside = step(bl + border_thickness, st);
    vec2 trv_inside = 1. - step(tr - border_thickness, st);
    float inside = blv_inside.x * trv_inside.x * blv_inside.y * trv_inside.y;

    pct *= 1. - inside;

    return pct;
}

float rectangle(in vec2 st, vec2 bl, vec2 tr) {
    // bottom-left
    vec2 blv = step(bl, st);
    float pct = blv.x * blv.y;

    // top-right
    vec2 trv = vec2(1.) - step(tr, st);
    pct *= trv.x * trv.y;

    return pct;
}

float line(in vec2 pos, float xpos, float width) {
    float pct = step(xpos - width / 2., pos.x);
    pct *= 1. - step(xpos + width / 2., pos.x);
    return pct;
}

float line(in vec2 pos, float xpos) {
    return line(pos, xpos, .04);
}

// result 1:
vec3 rectangle_magic(vec2 st) {
    vec2 pos = vec2(st);
    pos += noise(pos * (10. * u_time));

    float pct = rectangle_outline(pos, vec2(0.), vec2(1.));

    pct += rectangle_outline(pos, vec2(.3), vec2(.6));
    pct += rectangle_outline(pos, vec2(.15), vec2(.85));

    return vec3(pct * (.5 + .5 * sin(u_time * 2.)), pct * .3, pct);
}

// result 2:
vec3 wiggly_line(vec2 st) {
    vec2 pos = vec2(st);
    pos += noise(pos * (1. * u_time));

    float pct = line(pos, .1);
    pct += line(pos, .3);
    pct += line(pos, .5);
    pct += line(pos, .7);
    pct += line(pos, .9);

    return vec3(pct * (.5 + .5 * sin(u_time * 1.)), pct * .3, pct);
}

vec3 distance_field(vec2 st) {
    vec2 pos = vec2(st);
    pos *= 2.;
    vec2 ipos = floor(pos);
    vec2 fpos = fract(pos);
    // pos += noise(pos * (5. + 3. * noise(vec2(u_time))));

    float pct = distance(fpos, vec2(.5, 0.5));
    // pct *= distance(pos, vec2(.25, .3));
    // pct *= distance(pos, vec2(.85, .4));
    // pct /= 3.;

    return vec3(pct * (.5 + .5 * sin(u_time * 2.)), pct * .3, pct);
}

mat2 rotate2d(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    //color = rectangle_magic(st);
    color = wiggly_line(st);
    // color = distance_field(st);
    gl_FragColor = vec4(color, 1.0);
}
