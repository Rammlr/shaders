#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float draw_rectangle(in vec2 st, in vec2 bottom_left, in vec2 top_right) {
    // bottom left
    vec2 bottom_left_pct = step(bottom_left.xy, st.xy);

    // top right
    vec2 top_right_pct = step(st.xy, top_right.xy);

    return bottom_left_pct.x * top_right_pct.x 
    * bottom_left_pct.y * top_right_pct.y;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 austria_red = vec3(201. / 255., 8. / 255., 42. / 255.);
    float one_third = 1. / 3.;

    float upper_rectangle = draw_rectangle(st, vec2(0., 2. * one_third), vec2(1., 1.));
    float middle_rectangle = draw_rectangle(st, vec2(0., one_third), vec2(1., 2. * one_third));
    float lower_rectangle = draw_rectangle(st, vec2(0., 0.), vec2(1., one_third));

    vec3 color = austria_red * upper_rectangle 
    + middle_rectangle * vec3(1.)
    + lower_rectangle * austria_red;

    gl_FragColor = vec4(color, 1.0);
}