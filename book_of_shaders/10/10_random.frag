#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
        43758.5453123);
}

float random(float f) {
    return random(vec2(f));
}

float round(float f, float brightness) {
    return floor(f + brightness);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float brightness = .7;

    float upper_lower_half = round(st.y, .5);
    st *= 100.0; // Scale the coordinate system by 10
    float ix = floor(st.x);
    float fx = fract(st.x);
    float iy = floor(st.y);
    float fy = fract(st.y);
    vec2 ipos = floor(st);  // get the integer coords
    vec2 fpos = fract(st);  // get the fractional coords

    // Assign a random value based on the integer coord
    vec3 color = vec3(round(random(vec2(ix, ix * upper_lower_half)), brightness));

    gl_FragColor = vec4(color, 1.0);
}
