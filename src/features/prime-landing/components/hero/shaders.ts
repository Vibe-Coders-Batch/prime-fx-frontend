export const portalVert = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uPixelRatio;
  uniform float uSize;

  attribute vec3 aMorphPosition;
  attribute float aScatter;

  varying float vDepth;
  varying float vScatter;

  void main() {
    vec3 basePos = mix(position, aMorphPosition, uMorph);
    float breathe = sin(uTime * 0.8 + aScatter * 6.2831) * 0.015;
    vec3 pos = basePos + normalize(basePos) * breathe;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depth = -mvPosition.z;
    gl_PointSize = uSize * uPixelRatio * (1.0 / max(depth, 0.1));

    vDepth = depth;
    vScatter = aScatter;
  }
`;

export const portalFrag = /* glsl */ `
  precision highp float;

  uniform vec3 uColorGold;
  uniform vec3 uColorElectric;

  varying float vDepth;
  varying float vScatter;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d);
    alpha = pow(alpha, 1.6);

    if (alpha < 0.02) discard;

    float t = clamp(vDepth / 8.0, 0.0, 1.0);
    vec3 color = mix(uColorElectric, uColorGold, t);
    color *= 0.85 + vScatter * 0.3;

    gl_FragColor = vec4(color, alpha);
  }
`;

