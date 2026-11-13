/**
 * The preloader: a sheet of marbled paper being made, the way Kent's marble was. Drops of ink land on
 * water one after another; each spreads and pushes every ring before it outward (Aubrey Jaffer's exact,
 * area-keeping drop transform, worked backwards per pixel). Then a fine comb is drawn down through them, a
 * wave across, and a stylus turned once in the middle, which pulls the rings into marble. Then the sheet
 * lifts off piece by piece, each drop's colour all at once: the paper first, then the flood, the ink last,
 * so the page shows through the marble before the last of it lets go.
 *
 * WebGL 2, one triangle, four samples a pixel for clean edges.
 */

const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

export const DROPS = 12;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform vec2 uRes;
uniform float uT;
/** how far the comb has been drawn down, the wave across, and the stylus turned: 0 to 1 */
uniform float uComb;
uniform float uWave;
uniform float uSwirl;
/** the paper clearing: below this, a colour has let go */
uniform float uReveal;
uniform vec3 uInk;
uniform vec3 uFlood;
uniform vec3 uPaper;
/** each drop: centre (in height units, from the middle), final radius, the moment it lands */
uniform vec4 uDrops[${DROPS}];
/** each drop's colour: 0 paper, 1 flood, 2 ink */
uniform float uColor[${DROPS}];

// what lies here once every drop and stroke is done: the drop's colour and which drop it was
// (-1 for the bare water)
vec2 colourAt(vec2 p) {
  // the strokes came last, so they're undone first: the turn of the stylus, the wave, the comb
  float a = -2.4 * uSwirl * exp(-length(p - vec2(0.08, -0.02)) / 0.3);
  vec2 q = p - vec2(0.08, -0.02);
  p = vec2(0.08, -0.02) + vec2(q.x * cos(a) - q.y * sin(a), q.x * sin(a) + q.y * cos(a));
  p.x -= 0.05 * uWave * sin(p.y * 9.0 + 1.3);
  const float s = 0.075;
  float d = abs(mod(p.x + s * 0.5, s) - s * 0.5);
  p.y -= 0.2 * uComb * exp2(-d / 0.014);
  // then the drops, the newest first
  for (int i = ${DROPS - 1}; i >= 0; i--) {
    vec4 D = uDrops[i];
    float g = clamp((uT - D.w) / 0.55, 0.0, 1.0);
    float r = D.z * (1.0 - pow(1.0 - g, 3.0));
    if (r <= 0.0) continue;
    vec2 v = p - D.xy;
    float l2 = dot(v, v);
    if (l2 < r * r) return vec2(uColor[i], float(i));
    p = D.xy + v * sqrt(1.0 - r * r / l2);
  }
  return vec2(-1.0);
}

vec3 tint(float c) {
  return c > 1.5 ? uInk : (c > 0.5 ? uFlood : uPaper);
}

// how long a colour holds on as the paper clears: the paper first, the ink last
float hold(float c) {
  return c > 1.5 ? 0.9 : (c > 0.5 ? 0.55 : 0.18);
}

void main() {
  vec2 px = 1.0 / uRes;
  vec3 col = vec3(0.0);
  float alpha = 0.0;
  for (int k = 0; k < 4; k++) {
    vec2 o = (vec2(float(k % 2), float(k / 2)) - 0.5) * 0.5 * px;
    vec2 uv = vUv + o;
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    vec2 c = colourAt(p);
    col += tint(c.x);
    // each drop's colour lifts off all at once, the drops in a scattered order, the paper first
    float h = c.x < 0.0 ? 0.05 : hold(c.x) + fract(sin(c.y * 12.9898 + 4.1) * 43758.5453) * 0.22;
    alpha += 1.0 - smoothstep(h - 0.006, h + 0.006, uReveal + uv.y * 0.04);
  }
  col *= 0.25;
  alpha *= 0.25;
  outColor = vec4(col * alpha, alpha);
}`;

export type Marbler = {
  draw: (s: { width: number; height: number; t: number; comb: number; wave: number; swirl: number; reveal: number; ink: number[]; flood: number[]; paper: number[] }) => void;
  dispose: () => void;
};

export function createMarbler(canvas: HTMLCanvasElement, drops: number[][], colours: number[]): Marbler | null {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
  if (!gl) return null;
  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform4fv(u("uDrops"), new Float32Array(drops.flat()));
  gl.uniform1fv(u("uColor"), new Float32Array(colours));
  const loc = { res: u("uRes"), t: u("uT"), comb: u("uComb"), wave: u("uWave"), swirl: u("uSwirl"), reveal: u("uReveal"), ink: u("uInk"), flood: u("uFlood"), paper: u("uPaper") };

  return {
    draw: ({ width, height, t, comb, wave, swirl, reveal, ink, flood, paper }) => {
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(loc.res, width, height);
      gl.uniform1f(loc.t, t);
      gl.uniform1f(loc.comb, comb);
      gl.uniform1f(loc.wave, wave);
      gl.uniform1f(loc.swirl, swirl);
      gl.uniform1f(loc.reveal, reveal);
      gl.uniform3fv(loc.ink, ink);
      gl.uniform3fv(loc.flood, flood);
      gl.uniform3fv(loc.paper, paper);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose: () => {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}
