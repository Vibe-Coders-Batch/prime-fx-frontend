// ─── Page curl vertex ─────────────────────────────────────────────────────────
export const pageCurlVert = /* glsl */ `
  uniform float uCurlProgress;
  uniform float uLift;
  varying vec2  vUv;
  varying float vCurlFactor;
  varying float vBackFace;
  const float PI = 3.14159265359;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float t          = pos.x + 0.5;
    float foldCenter = 1.0 - uCurlProgress;
    float inCurl     = smoothstep(foldCenter + 0.28, foldCenter - 0.28, t);
    float angle      = inCurl * PI;

    pos.z += sin(angle) * uLift;
    pos.x += (cos(angle) - 1.0) * t * 0.45;

    vCurlFactor = inCurl;
    vBackFace   = step(0.5, inCurl);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ─── Page fragment — clean premium paper, no fake text ───────────────────────
// Just cream paper + gold rules + a delicate corner ornament.
// Content is rendered as HTML overlaid on the open spread.
export const pageCurlFrag = /* glsl */ `
  precision highp float;
  uniform vec3  uPaperColor;
  uniform float uCurlProgress;
  uniform float uPageIndex;
  varying vec2  vUv;
  varying float vCurlFactor;
  varying float vBackFace;

  const vec3  GOLD = vec3(0.878, 0.706, 0.345);
  const float PI   = 3.14159265359;

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float hRule(float y, float h) {
    return smoothstep(h, 0.0, abs(vUv.y - y));
  }

  // Thin diamond ornament at a UV position
  float diamond(vec2 uv, vec2 c, float s) {
    vec2 d = abs(uv - c);
    return smoothstep(s + 0.003, s - 0.003, d.x + d.y);
  }

  float ring(vec2 uv, vec2 c, float r, float w) {
    float d = length(uv - c);
    return smoothstep(r+w+0.003, r+w-0.003, d) - smoothstep(r+0.003, r-0.003, d);
  }

  void main() {
    // Paper base with very subtle grain
    float grain = rand(vUv * 420.0) * 0.010 - 0.005;
    vec3 col    = uPaperColor + grain;

    // Spine shadow (left edge)
    col *= 1.0 - smoothstep(0.0, 0.06, vUv.x) * 0.20;

    // ── Gold top rule ─────────────────────────────────────────────────────────
    col = mix(col, GOLD, hRule(0.935, 0.004) * 0.80);
    // Thin secondary line below it
    col = mix(col, GOLD, hRule(0.920, 0.002) * 0.40);

    // ── Gold bottom rule ──────────────────────────────────────────────────────
    col = mix(col, GOLD, hRule(0.068, 0.004) * 0.80);
    col = mix(col, GOLD, hRule(0.083, 0.002) * 0.40);

    // ── Corner diamond ornaments (top-left & bottom-right) ────────────────────
    float aspect = 0.73;
    vec2 auv     = vec2(vUv.x * aspect, vUv.y);

    // Top-left corner: cluster of 3 diamonds
    col = mix(col, GOLD, diamond(auv, vec2(0.05, 0.91), 0.012) * 0.65);
    col = mix(col, GOLD, diamond(auv, vec2(0.07, 0.91), 0.007) * 0.50);
    col = mix(col, GOLD, diamond(auv, vec2(0.05, 0.89), 0.007) * 0.50);

    // Bottom-right corner
    col = mix(col, GOLD, diamond(auv, vec2(aspect - 0.05, 0.09), 0.012) * 0.65);
    col = mix(col, GOLD, diamond(auv, vec2(aspect - 0.07, 0.09), 0.007) * 0.50);
    col = mix(col, GOLD, diamond(auv, vec2(aspect - 0.05, 0.11), 0.007) * 0.50);

    // ── Subtle watermark ring (page index varies position slightly) ───────────
    vec2 wmC = vec2(aspect * 0.5, 0.50 + uPageIndex * 0.015);
    col = mix(col, GOLD * 0.6, ring(auv, wmC, 0.065, 0.0025) * 0.12);
    col = mix(col, GOLD * 0.6, ring(auv, wmC, 0.040, 0.0015) * 0.10);

    // Page number dot at bottom center
    float pgDot = smoothstep(0.006, 0.0, length(auv - vec2(aspect * 0.5, 0.045)));
    col = mix(col, GOLD * 0.9, pgDot * 0.55);

    // ── Back face dimming ─────────────────────────────────────────────────────
    col *= mix(1.0, 0.60, vBackFace);

    // ── Curl self-shadow ──────────────────────────────────────────────────────
    col *= 1.0 - sin(vCurlFactor * PI) * 0.20;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ─── Cover front face — crest emblem ─────────────────────────────────────────
export const coverFaceVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const coverFaceFrag = /* glsl */ `
  precision highp float;
  uniform float uGlow;
  uniform float uTime;
  varying vec2 vUv;

  const vec3 GOLD = vec3(0.878, 0.706, 0.345);

  float ring(vec2 uv, vec2 c, float r, float w) {
    float d = length(uv - c);
    return smoothstep(r+w+0.004, r+w-0.004, d) - smoothstep(r+0.004, r-0.004, d);
  }
  float circle(vec2 uv, vec2 c, float r) {
    return smoothstep(r+0.005, r-0.005, length(uv - c));
  }
  float diamond(vec2 uv, vec2 c, float s) {
    vec2 d = abs(uv - c);
    return smoothstep(s+0.004, s-0.004, d.x + d.y);
  }
  float filigree(vec2 uv) {
    vec2 g = fract(uv * 14.0) - 0.5;
    float d = abs(g.x) + abs(g.y);
    return 1.0 - smoothstep(0.44, 0.50, d);
  }

  void main() {
    float aspect = 0.74;
    vec2 uv = vUv;
    vec2 auv = vec2(uv.x * aspect, uv.y);

    // Border frame (double line)
    float fw = 0.028;
    float outerF = (1.0 - step(fw, uv.x)*step(uv.x,1.0-fw)*step(fw,uv.y)*step(uv.y,1.0-fw));
    float fw2 = fw + 0.014;
    float innerF = (1.0 - step(fw2,uv.x)*step(uv.x,1.0-fw2)*step(fw2,uv.y)*step(uv.y,1.0-fw2))
                  * step(fw,uv.x)*step(uv.x,1.0-fw)*step(fw,uv.y)*step(uv.y,1.0-fw);

    // Corner diamonds
    vec2 c0 = vec2(fw*aspect + 0.012, fw + 0.012);
    float corners = diamond(auv, c0, 0.016)
                  + diamond(auv, vec2(aspect - c0.x, c0.y),    0.016)
                  + diamond(auv, vec2(c0.x,           1.0-c0.y), 0.016)
                  + diamond(auv, vec2(aspect-c0.x,    1.0-c0.y), 0.016);

    // Central emblem
    vec2 emblC = vec2(aspect * 0.5, 0.62);
    float er   = 0.095;
    float embl = ring(auv, emblC, er,      0.007)
               + ring(auv, emblC, er*0.65, 0.004)
               + ring(auv, emblC, er*0.35, 0.003)
               + circle(auv, emblC, 0.020);

    // Radial spokes inside outer ring
    vec2  ec    = auv - emblC;
    float angle = atan(ec.y, ec.x);
    float spoke = smoothstep(0.014, 0.0, abs(mod(angle + 3.14159, 0.7854) - 0.3927));
    float spokeM = circle(auv, emblC, er*0.93) - circle(auv, emblC, er*0.68);
    embl += spoke * max(0.0, spokeM) * 0.5;

    // Title bars below emblem
    float tb1 = smoothstep(0.007, 0.0, abs(auv.y - (emblC.y - 0.165)))
              * step(emblC.x - 0.085, auv.x) * step(auv.x, emblC.x + 0.085);
    float tb2 = smoothstep(0.005, 0.0, abs(auv.y - (emblC.y - 0.190)))
              * step(emblC.x - 0.060, auv.x) * step(auv.x, emblC.x + 0.060);
    float tagLine = smoothstep(0.003, 0.0, abs(auv.y - (emblC.y - 0.215)))
                  * step(emblC.x - 0.045, auv.x) * step(auv.x, emblC.x + 0.045);

    // Background filigree (very faint)
    float fil = filigree(uv) * 0.04;

    float pulse = 0.82 + 0.18 * sin(uTime * 1.3);
    float mask  = clamp(outerF*0.75 + innerF*0.45 + corners*0.85
                      + embl*0.95 + tb1*0.80 + tb2*0.65
                      + tagLine*0.55 + fil, 0.0, 1.0);

    float alpha = mask * uGlow * pulse;
    gl_FragColor = vec4(GOLD * alpha, alpha);
  }
`;

// ─── Gold filigree inlay ──────────────────────────────────────────────────────
export const goldInlayVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const goldInlayFrag = /* glsl */ `
  precision highp float;
  uniform float uEmissiveStrength;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2  g   = fract(vUv * 16.0) - 0.5;
    float d   = abs(g.x) + abs(g.y);
    float p   = (1.0 - smoothstep(0.42, 0.50, d)) * 0.6;
    vec2  co  = min(vUv, 1.0 - vUv);
    p        += smoothstep(0.06, 0.04, length(co - 0.04));
    float pulse = 0.82 + 0.18 * sin(uTime * 1.2);
    vec3  gold  = vec3(0.878, 0.706, 0.345);
    float a     = clamp(p, 0.0, 1.0) * uEmissiveStrength * pulse;
    gl_FragColor = vec4(gold * a, a);
  }
`;

// ─── Dust motes ──────────────────────────────────────────────────────────────
export const dustVert = /* glsl */ `
  attribute float aSize;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec3 pos = position;
    pos.y    = mod(pos.y + uTime * aSpeed * 0.04, 4.0) - 2.0;
    pos.x   += sin(uTime * aSpeed * 0.3 + position.z * 3.0) * 0.04;
    vec4 mv  = modelViewMatrix * vec4(pos, 1.0);
    gl_Position  = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (3.0 / -mv.z);
    vAlpha = 0.10 + aSize * 0.05;
  }
`;

export const dustFrag = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(0.878, 0.706, 0.345, a);
  }
`;
