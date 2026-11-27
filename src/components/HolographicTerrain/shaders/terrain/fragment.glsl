uniform sampler2D uTexture;
uniform float uTime;
uniform float uTextureFrequency;
uniform float uTextureOffset;
uniform float uHslHue;
uniform float uHslHueOffset;
uniform float uHslHueFrequency;
uniform float uHslTimeFrequency;
uniform float uHslLightness;
uniform float uHslLightnessVariation;
uniform float uHslLightnessFrequency;

varying float vElevation;
varying vec2 vUv;

#pragma glslify: getElevation = require('../partials/getElevation.glsl')
#pragma glslify: getPerlinNoise2d = require('../partials/getPerlinNoise2d.glsl')

vec3 getLavaColor()
{
    vec2 uv = vUv;
    uv.y += uTime * uHslTimeFrequency;

    // Organic noise for molten flow
    float n1 = getPerlinNoise2d(uv * uHslHueFrequency);
    float n2 = getPerlinNoise2d(uv * uHslLightnessFrequency + 1234.5 - uTime * 0.15);

    // Pulsating wave
    float pulse = sin(uTime * 2.2 + n1 * 4.0) * 0.5 + 0.5;
    float heat = clamp((n1 * 0.5 + 0.5) * 0.65 + (n2 * 0.5 + 0.5) * 0.35 + pulse * 0.25, 0.0, 1.0);

    // Lava palette: deep crimson -> fiery orange (#ff8408) -> hot yellow-gold
    vec3 deepRed = vec3(0.45, 0.03, 0.0);
    vec3 moltenOrange = vec3(1.0, 0.38, 0.02);
    vec3 hotGold = vec3(1.0, 0.82, 0.25);

    vec3 lavaColor = mix(deepRed, moltenOrange, smoothstep(0.15, 0.65, heat));
    lavaColor = mix(lavaColor, hotGold, smoothstep(0.65, 1.0, heat));

    // Boost brightness on pulse peaks for bloom/glow
    lavaColor *= 0.85 + pulse * 0.65;

    return lavaColor;
}

void main()
{
    vec3 uColor = vec3(1.0, 0.72, 0.35);

    vec3 lavaColor = getLavaColor();
    vec4 textureColor = texture2D(uTexture, vec2(0.0, vElevation * uTextureFrequency + uTextureOffset));

    vec3 color = mix(uColor, lavaColor, textureColor.r);

    float fadeSideAmplitude = 0.2;
    float sideAlpha = 1.0 - max(
        smoothstep(0.5 - fadeSideAmplitude, 0.5, abs(vUv.x - 0.5)),
        smoothstep(0.5 - fadeSideAmplitude, 0.5, abs(vUv.y - 0.5))
    );

    gl_FragColor = vec4(color, textureColor.a * sideAlpha);
}
