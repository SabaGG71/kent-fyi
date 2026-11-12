/**
 * The vines photograph as a living print. A depth map (Depth Anything V2, near = bright) gives every pixel a
 * distance, so as the frame passes through the screen the near leaves slide a touch faster than the two of
 * them (a small 3D parallax, small enough that nothing tears), and only the near leaves sway in a breeze.
 * Nothing is blurred: the photo stays as sharp as the file. WebGL 2, so the non-power-of-two photo gets
 * mipmaps and stays clean when drawn smaller. One triangle, no libraries.
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

uniform sampler2D uTex;
uniform sampler2D uDepth;
uniform vec2 uRes;
uniform vec2 uImg;
/** object-position of the crop */
uniform vec2 uPos;
/** where the frame is on its way through the screen: -1 just entering below, 1 leaving at the top */
uniform float uDrift;
/** extra scale, eased down to 1 as the frame arrives */
uniform float uZoom;
uniform float uTime;
/** how much the near leaves move in the breeze */
uniform float uSway;

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

// object-fit: cover at uZoom, at object-position uPos
vec2 cover(vec2 uv) {
  float sr = uRes.x / uRes.y;
  float ir = uImg.x / uImg.y;
  vec2 s = (sr > ir ? vec2(1.0, ir / sr) : vec2(sr / ir, 1.0)) / uZoom;
  return uPos + (uv - uPos) * s;
}

void main() {
  vec2 uv = cover(vUv);

  // depth parallax: nearer than the two of them slides one way, further the other, a few pixels at most
  vec2 s = uv;
  for (int i = 0; i < 2; i++) {
    float d = texture(uDepth, s).r;
    s = uv + vec2(0.004, 0.022) * (d - 0.3) * uDrift;
  }
  float d = texture(uDepth, s).r;

  // a light breeze through the near leaves only
  float leaf = smoothstep(0.35, 0.85, d);
  float t = uTime * 0.2;
  vec2 breeze = vec2(noise(s * 3.0 + vec2(t, 0.0)), noise(s * 3.0 + vec2(17.3, t * 0.8))) - 0.5;
  s += breeze * 0.002 * leaf * uSway;

  outColor = vec4(texture(uTex, clamp(s, 0.0, 1.0)).rgb, 1.0);
}`;

export type VinesStage = {
  setPhoto: (img: TexImageSource, w: number, h: number) => void;
  setDepth: (img: TexImageSource) => void;
  ready: () => boolean;
  draw: (s: { width: number; height: number; drift: number; zoom: number; time: number; sway: number }) => void;
  dispose: () => void;
};

export function createVines(canvas: HTMLCanvasElement, pos: readonly [number, number]): VinesStage | null {
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" });
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
  const uRes = u("uRes");
  const uImg = u("uImg");
  const uDrift = u("uDrift");
  const uZoom = u("uZoom");
  const uTime = u("uTime");
  const uSway = u("uSway");
  gl.uniform1i(u("uTex"), 0);
  gl.uniform1i(u("uDepth"), 1);
  gl.uniform2f(u("uPos"), pos[0], pos[1]);

  let photo: WebGLTexture | null = null;
  let depth: WebGLTexture | null = null;
  let imgW = 3;
  let imgH = 2;

  const upload = (unit: number, source: TexImageSource, isPhoto: boolean) => {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, isPhoto ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    if (isPhoto) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, gl.RED, gl.UNSIGNED_BYTE, source);
    }
    return texture;
  };

  return {
    setPhoto: (img, w, h) => {
      if (photo) gl.deleteTexture(photo);
      photo = upload(0, img, true);
      imgW = w;
      imgH = h;
    },
    setDepth: (img) => {
      if (depth) gl.deleteTexture(depth);
      depth = upload(1, img, false);
    },
    ready: () => !!photo && !!depth,
    draw: ({ width, height, drift, zoom, time, sway }) => {
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
      gl.uniform2f(uImg, imgW, imgH);
      gl.uniform1f(uDrift, drift);
      gl.uniform1f(uZoom, zoom);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uSway, sway);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose: () => {
      if (photo) gl.deleteTexture(photo);
      if (depth) gl.deleteTexture(depth);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}
