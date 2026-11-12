/**
 * The project stage: one photo replaced by the next the way a glass fills. The new photo rises from the
 * bottom of the frame under a soft, moving surface with a thin bright meniscus, and the light bends a little
 * just beneath it. Between changes the photo only breathes. WebGL 1, one triangle, two textures, no libraries.
 */

const VERT = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  // y runs down, like the image and the page
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;

uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform vec2 uRes;
uniform vec2 uImg;
/** object-position of each photo's crop */
uniform vec2 uPosFrom;
uniform vec2 uPosTo;
/** 0 all the old photo, 1 all the new one */
uniform float uP;
/** a slow breath of scale while the photo rests */
uniform float uBreath;
uniform float uTime;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// object-fit: cover at a zoom, at an object-position
vec2 cover(vec2 uv, vec2 pos, float zoom) {
  float sr = uRes.x / uRes.y;
  float ir = uImg.x / uImg.y;
  vec2 s = (sr > ir ? vec2(1.0, ir / sr) : vec2(sr / ir, 1.0)) / zoom;
  return pos + (uv - pos) * s;
}

void main() {
  vec2 uv = vUv;
  float pour = sin(uP * 3.14159265);

  // the surface: starts just under the frame, ends just over it, and moves like liquid on the way
  float wave = (noise(vec2(uv.x * 2.2, uTime * 0.7)) - 0.5) * 0.11 + sin(uv.x * 5.0 + uTime * 2.2) * 0.014;
  float level = mix(1.14, -0.14, uP) + wave * pour;
  float below = uv.y - level;
  float inside = smoothstep(-0.003, 0.003, below);

  // the old photo lifts a touch as it drains, the new one settles into place as it fills
  vec2 a = cover(uv + vec2(0.0, 0.035 * uP), uPosFrom, uBreath + 0.04 * uP);
  vec2 b = cover(uv - vec2(0.0, 0.05 * (1.0 - uP)), uPosTo, uBreath + 0.08 * (1.0 - uP));
  // light bends just under the surface
  float lens = exp(-max(below, 0.0) * 40.0) * inside * pour;
  b += vec2(sin(uv.y * 60.0 + uTime * 3.0), cos(uv.x * 50.0 - uTime * 2.0)) * 0.004 * lens;

  vec3 col = mix(texture2D(uFrom, clamp(a, 0.0, 1.0)).rgb, texture2D(uTo, clamp(b, 0.0, 1.0)).rgb, inside);
  // the meniscus: a hairline of light riding the surface, with a little shade just beneath it
  col += vec3(1.0, 0.94, 0.86) * exp(-abs(below) * 260.0) * 0.45 * pour;
  col *= 1.0 - 0.22 * lens;

  gl_FragColor = vec4(col, 1.0);
}`;

export type PourStage = {
  /** upload a photo into one of the slots, by index */
  setPhoto: (i: number, img: TexImageSource, w: number, h: number) => void;
  ready: (i: number) => boolean;
  draw: (s: { width: number; height: number; from: number; to: number; p: number; breath: number; time: number }) => void;
  dispose: () => void;
};

export function createPour(canvas: HTMLCanvasElement, positions: readonly (readonly [number, number])[]): PourStage | null {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" });
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

  // one triangle that overshoots the viewport covers it with no seam
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    res: u("uRes"),
    img: u("uImg"),
    posFrom: u("uPosFrom"),
    posTo: u("uPosTo"),
    p: u("uP"),
    breath: u("uBreath"),
    time: u("uTime"),
  };
  gl.uniform1i(u("uFrom"), 0);
  gl.uniform1i(u("uTo"), 1);

  const textures: (WebGLTexture | null)[] = positions.map(() => null);
  let imgW = 4;
  let imgH = 5;

  const bind = (unit: number, i: number) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, textures[i]);
  };

  return {
    setPhoto: (i, img, w, h) => {
      if (textures[i]) gl.deleteTexture(textures[i]);
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      textures[i] = texture;
      imgW = w;
      imgH = h;
    },
    ready: (i) => !!textures[i],
    draw: ({ width, height, from, to, p, breath, time }) => {
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      bind(0, textures[from] ? from : to);
      bind(1, to);
      gl.uniform2f(loc.res, width, height);
      gl.uniform2f(loc.img, imgW, imgH);
      gl.uniform2f(loc.posFrom, positions[from][0], positions[from][1]);
      gl.uniform2f(loc.posTo, positions[to][0], positions[to][1]);
      gl.uniform1f(loc.p, p);
      gl.uniform1f(loc.breath, breath);
      gl.uniform1f(loc.time, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose: () => {
      textures.forEach((t) => t && gl.deleteTexture(t));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}
