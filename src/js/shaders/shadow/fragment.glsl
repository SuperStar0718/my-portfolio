uniform sampler2D alphaMask;
uniform vec3 uColor;

varying vec2 vUv;

void main()
{
    float alpha = texture2D(alphaMask, vUv).r;

    alpha = 1.0 - alpha;

    gl_FragColor = vec4(uColor, alpha);
}