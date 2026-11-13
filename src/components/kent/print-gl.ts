/**
 * The hero picture, and the marble you can stir into it.
 *
 * At rest the photograph shows as it is, sharp and in colour. Drag across it and you marble it, the way
 * marbled paper is made: the picture is pushed along with your hand like ink floating on water, and
 * wherever it has been stirred it turns into Kent's marble print. Wherever the picture is darker than his
 * marble (1.JPG, equalised), ink; elsewhere, the flood colour, both from the chosen proof. Left alone, it
 * heals back to the photograph. A change of picture grows through the marble's own veins, with a band
 * of marbled ink riding the edge.
 *
 * WebGL 2, one triangle, no libraries. The stir is a small offset field kept on the CPU (print-viewer.tsx)
 * and uploaded each frame as a half-float texture.
 */

const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  // y runs down, like the image and the page
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uMarble;
uniform sampler2D uA;
uniform sampler2D uB;
uniform sampler2D uStir;
uniform vec2 uRes;
/** 0 all picture A, 1 all picture B */
uniform float uMix;
uniform float uTime;
uniform vec3 uInk;
uniform vec3 uFlood;

float luma(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// the curl of a noise field: a flow with no sources or sinks, so the marble swirls without bunching up
vec2 curl(vec2 p) {
  const float e = 0.02;
  float a = noise(p + vec2(0.0, e));
  float b = noise(p - vec2(0.0, e));
  float c = noise(p + vec2(e, 0.0));
  float d = noise(p - vec2(e, 0.0));
  return vec2(a - b, d - c) / (2.0 * e);
}

// the pictures are 4:5; any other frame crops them the way object-fit: cover does
vec2 cover(vec2 uv) {
  float frame = uRes.x / uRes.y;
  vec2 s = frame > 0.8 ? vec2(1.0, 0.8 / frame) : vec2(frame / 0.8, 1.0);
  return 0.5 + (uv - 0.5) * s;
}

vec3 picture(sampler2D tex, vec2 uv) {
  return texture(tex, clamp(uv, 0.0, 1.0)).rgb;
}

void main() {
  vec2 uv = cover(vUv);

  // the stir: how far the cursor has pushed this point, healing back on its own
  vec2 s = texture(uStir, vUv).rg;
  float stirred = length(s);

  // the marble, carried by a slow flow and dragged further than the picture, so its veins trail
  vec2 m = uv - s * 1.7;
  m += curl(m * 2.0 + vec2(uTime * 0.035, -uTime * 0.025)) * 0.011;
  float T = texture(uMarble, m).r;

  // the change of picture grows through a coarser read of the same marble, vein by vein
  float vein = texture(uMarble, uv * 0.42 + vec2(0.31, 0.17)).r;
  float k = smoothstep(vein - 0.05, vein + 0.05, uMix * 1.1 - 0.05);

  vec2 p = uv - s;
  vec3 photo = mix(picture(uA, p), picture(uB, p), k);

  // printed where it's been stirred, and in a band along the edge of a change
  float front = 1.0 - abs(2.0 * k - 1.0);
  float printed = max(smoothstep(0.003, 0.03, stirred), smoothstep(0.2, 0.8, front));

  // ink where the picture is darker than the marble, with an edge about a pixel wide
  float d = T - luma(photo);
  float w = clamp(fwidth(d) * 0.7, 0.003, 0.06);
  vec3 print = mix(uFlood, uInk, smoothstep(-w, w, d));

  outColor = vec4(mix(photo, print, printed), 1.0);
}`;

export type Rgb = readonly [number, number, number];

export type Printer = {
  setPicture: (slot: number, img: TexImageSource) => void;
  setMarble: (img: TexImageSource) => void;
  /** the stir field: interleaved x, y offsets, in canvas uv, w by h cells */
  setStir: (data: Float32Array, w: number, h: number) => void;
  ready: (slot: number) => boolean;
  draw: (s: { width: number; height: number; from: number; to: number; mix: number; time: number; ink: Rgb; flood: Rgb }) => void;
  dispose: () => void;
};

export function createPrinter(canvas: HTMLCanvasElement, slots: number): Printer | null {
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false });
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
    mix: u("uMix"),
    time: u("uTime"),
    ink: u("uInk"),
    flood: u("uFlood"),
  };
  gl.uniform1i(u("uMarble"), 0);
  gl.uniform1i(u("uA"), 1);
  gl.uniform1i(u("uB"), 2);
  gl.uniform1i(u("uStir"), 3);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

  const upload = (img: TexImageSource, wrap: number) => {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    return texture;
  };

  // the stir field: two half floats a cell, filtered, starting still
  const stir = gl.createTexture();
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, stir);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, 1, 1, 0, gl.RG, gl.FLOAT, new Float32Array(2));
  let stirW = 1;
  let stirH = 1;

  let marble: WebGLTexture | null = null;
  const pictures: (WebGLTexture | null)[] = Array.from({ length: slots }, () => null);
  const bind = (unit: number, texture: WebGLTexture | null) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
  };

  return {
    setMarble: (img) => {
      if (marble) gl.deleteTexture(marble);
      // mirrored, so the flow can carry the marble past the edge without a seam
      marble = upload(img, gl.MIRRORED_REPEAT);
    },
    setPicture: (slot, img) => {
      if (pictures[slot]) gl.deleteTexture(pictures[slot]);
      pictures[slot] = upload(img, gl.CLAMP_TO_EDGE);
    },
    setStir: (data, w, h) => {
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, stir);
      if (w !== stirW || h !== stirH) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, w, h, 0, gl.RG, gl.FLOAT, data);
        stirW = w;
        stirH = h;
      } else {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RG, gl.FLOAT, data);
      }
    },
    ready: (slot) => !!marble && !!pictures[slot],
    draw: ({ width, height, from, to, mix, time, ink, flood }) => {
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      bind(0, marble);
      bind(1, pictures[from] ?? pictures[to]);
      bind(2, pictures[to]);
      bind(3, stir);
      gl.uniform2f(loc.res, width, height);
      gl.uniform1f(loc.mix, pictures[from] ? mix : 1);
      gl.uniform1f(loc.time, time);
      gl.uniform3f(loc.ink, ink[0], ink[1], ink[2]);
      gl.uniform3f(loc.flood, flood[0], flood[1], flood[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose: () => {
      pictures.forEach((t) => t && gl.deleteTexture(t));
      if (marble) gl.deleteTexture(marble);
      gl.deleteTexture(stir);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}
