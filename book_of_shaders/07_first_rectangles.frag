#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float rectangle_outline(in vec2 st, in vec2 bl, in vec2 tr){
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

float rectangle(in vec2 st, vec2 bl, vec2 tr){
    // bottom-left
    vec2 blv = step(bl, st);
    float pct = blv.x * blv.y;
    
    // top-right
    vec2 trv = vec2(1.) - step(tr, st);
    pct *= trv.x * trv.y;
    
    return pct;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

	float pct = rectangle_outline(st, vec2(.2, .2), vec2(.5, .8));
    
    pct += rectangle_outline(st, vec2(.3, .3), vec2(.6, .6));

    color = vec3(pct * sin(u_time * 5.), pct * .3, pct);

    gl_FragColor = vec4(color,1.0);
}
