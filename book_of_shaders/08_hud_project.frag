#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float rectangle_outline(in vec2 st, in vec2 bl, in vec2 tr, in float border_thickness){
    float smoothness = 0.00;

    // bottom-left
    vec2 blv = smoothstep(bl - smoothness, bl + smoothness, st);
    float pct = blv.x * blv.y;
    
    // top-right
    vec2 trv = 1. - smoothstep(tr - smoothness, tr + smoothness, st);
    pct *= trv.x * trv.y;
    
    vec2 blv_inside = step(bl + border_thickness, st);
    vec2 trv_inside = 1. - step(tr - border_thickness, st);
    float inside = blv_inside.x * trv_inside.x * blv_inside.y * trv_inside.y;
    
    pct *= 1. - inside;
    
    return pct;
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float cross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) +
            box(_st, vec2(_size/4.,_size));
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    float brightness_modulation = abs(sin(u_time * 2.)) / 2. + .3;
    vec3 rectangle_color = vec3(0.13, 0.55, 0.93) * brightness_modulation;
    color += rectangle_color * 
                rectangle_outline(st, vec2(.05), vec2(.95), 0.008);

    gl_FragColor = vec4(color,1.0);
}