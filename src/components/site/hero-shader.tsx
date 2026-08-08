import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Shaders                                                                     */
/* -------------------------------------------------------------------------- */

const VERTEX_SOURCE = `#version 300 es
precision highp float;
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`;

/**
 * Fractal-noise cloud field. Adapted from a shader by Matthias Hurrle
 * (@atzedent). Pointer uniforms from the original were dropped — only
 * `resolution` and `time` are fed in.
 *
 * RECOLOR (paleta de src/styles.css)
 * El campo era monocromo: la rampa iba de un gris frío al ámbar, así que todo
 * el hero se leía en una sola temperatura. Ahora la rampa va de teal a ámbar
 * (--accent-2 y --accent, casi complementarios) y la niebla que rellena la
 * periferia es índigo (--accent-3). El resultado es noche fría en los bordes y
 * brasa cálida en el centro, en vez de una sola bruma naranja.
 *
 * Las constantes van en sRGB no lineal, porque el shader escribe directo al
 * framebuffer. Son versiones más profundas de los tokens: estas luces se
 * acumulan de forma aditiva y con el valor nominal se quemarían a blanco.
 *
 * Brillo: el extremo frío de la rampa pasó de un gris (luminancia ~0.31) a un
 * teal (~0.51), de modo que la rampa emite ~20% más luz que antes. Se compensa
 * bajando INTENSITY de 0.55 a 0.50 y subiendo la viñeta de 0.45 a 0.50, que
 * oscurece justo los bordes — que es donde cae "SAID". El campo gana color sin
 * ganar brillo neto, y el texto blanco del hero sigue sin competencia.
 *
 * AURORAS MÁS GRUESAS Y NUBES VISIBLES (petición explícita)
 * Tres números, y sólo tres:
 *   · FLARE 0.0018 -> 0.0030. Es el numerador de un campo 1/d, así que subirlo
 *     no sólo aclara el núcleo: ensancha el radio al que la aurora sigue por
 *     encima del umbral de visión. Por eso engorda además de brillar.
 *   · FILAMENT 0.0022 -> 0.0030, para que los hilos de cobre acompañen y las
 *     auroras no queden lisas al ganar cuerpo.
 *   · HAZE de 0.050/0.060/0.118 a 0.105/0.130/0.255. Era índigo casi negro:
 *     las nubes existían pero no se veían. Al doblarlo el campo de nubes
 *     aparece de verdad, y en azul.
 * INTENSITY sube 0.50 -> 0.62 para acompañar. La VIÑETA se queda en 0.50: es
 * lo que protege las esquinas, y es donde cae "SAID". No la bajes para ganar
 * brillo — se gana en el centro, no en el texto.
 *
 * Los comentarios dentro del literal GLSL van en ASCII a propósito: el juego de
 * caracteres de GLSL ES 3.00 es un subconjunto de ASCII y un acento podría
 * hacer fallar la compilación en implementaciones estrictas — y si el shader no
 * compila, el hero se queda sin fondo en silencio.
 */
const FRAGMENT_SOURCE = `#version 300 es
precision highp float;

out vec4 O;
uniform vec2 resolution;
uniform float time;

#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x, R.y)

// --- palette: sRGB approximations of the design tokens in src/styles.css ---
// The ramp now runs cool -> warm (teal to amber) and the fog is indigo.
// Full rationale in the JSDoc above (kept out of here: GLSL ES is ASCII-only).
const vec3 COOL  = vec3(0.016, 0.639, 0.665); // ~ --accent-2,  deep teal
const vec3 AMBER = vec3(0.940, 0.630, 0.240); // ~ --accent,    signal amber
const vec3 EMBER = vec3(0.620, 0.400, 0.300); // copper, for the filaments
const vec3 HAZE  = vec3(0.105, 0.130, 0.255); // indigo fog: the visible clouds
const vec3 BASE  = vec3(0.031, 0.044, 0.069); // ~ --background, #080B12

const float INTENSITY = 0.62; // global dimmer, keeps white text legible
const float VIGNETTE  = 0.50; // edge falloff so the canvas melts into the page
const float FLARE     = 0.0030; // aurora core radius; see the JSDoc note
const float FILAMENT  = 0.0030; // copper threads woven through the aurorae

float rnd(vec2 p){ p=fract(p*vec2(12.9898,78.233)); p+=dot(p,p+34.56); return fract(p.x*p.y); }

float noise(in vec2 p){
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

float fbm(vec2 p){
  float t=.0, a=1.;
  mat2 m=mat2(1.,-.5,.2,1.2);
  for(int i=0;i<5;i++){ t+=a*noise(p); p*=2.*m; a*=.5; }
  return t;
}

float clouds(vec2 p){
  float d=1., t=.0;
  for(float i=.0;i<3.;i++){
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}

void main(void){
  vec2 uv=(FC-.5*R)/MN, st=uv*vec2(2,1);
  vec2 q=(FC-.5*R)/R; // normalized to the rect, for an even vignette
  vec3 col=vec3(0);

  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);

  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);

    // teal -> amber ramp replaces the original rainbow cos() palette; k swings
    // with the iteration, so cool and warm flares coexist in the same frame
    float k=.5+.5*sin(i*.7-1.2);
    col+=(FLARE/d)*mix(COOL,AMBER,k);

    float b=noise(i+p+bg*1.731);
    col+=(FILAMENT*b/length(max(p,vec2(b*p.x*.02,p.y))))*EMBER;

    col=mix(col,HAZE*bg,d);
  }

  col=max(col,vec3(0));
  col*=INTENSITY;
  col*=1.-VIGNETTE*smoothstep(.25,.72,length(q));
  col+=BASE; // floor at --background so the canvas edge is invisible

  O=vec4(col,1.);
}
`;

/* -------------------------------------------------------------------------- */
/* Renderer                                                                    */
/* -------------------------------------------------------------------------- */

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

/**
 * Minimal full-quad WebGL2 renderer. Module scope on purpose — the class is
 * defined once, not rebuilt on every render like in the original snippet.
 */
class WebGLRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly gl: WebGL2RenderingContext;
  private readonly program: WebGLProgram;
  private readonly vertexShader: WebGLShader;
  private readonly fragmentShader: WebGLShader;
  private readonly buffer: WebGLBuffer;
  private readonly vao: WebGLVertexArrayObject;
  private readonly uResolution: WebGLUniformLocation | null;
  private readonly uTime: WebGLUniformLocation | null;
  private disposed = false;

  private constructor(
    canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
    buffer: WebGLBuffer,
    vao: WebGLVertexArrayObject,
  ) {
    this.canvas = canvas;
    this.gl = gl;
    this.program = program;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.buffer = buffer;
    this.vao = vao;
    this.uResolution = gl.getUniformLocation(program, "resolution");
    this.uTime = gl.getUniformLocation(program, "time");
  }

  /** Returns `null` on any unsupported / failed step. Never throws. */
  static create(canvas: HTMLCanvasElement): WebGLRenderer | null {
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    if (!gl) return null;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SOURCE);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SOURCE);
    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return null;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return null;
    }

    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    if (!buffer || !vao) {
      if (buffer) gl.deleteBuffer(buffer);
      if (vao) gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return null;
    }

    const location = gl.getAttribLocation(program, "position");
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
    if (location >= 0) {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    }
    gl.bindVertexArray(null);

    return new WebGLRenderer(
      canvas,
      gl,
      program,
      vertexShader,
      fragmentShader,
      buffer,
      vao,
    );
  }

  /** Sizes the drawing buffer to a CSS box. Returns true if it changed. */
  resize(cssWidth: number, cssHeight: number, scale: number): boolean {
    if (this.disposed) return false;
    const width = Math.max(1, Math.round(cssWidth * scale));
    const height = Math.max(1, Math.round(cssHeight * scale));
    if (this.canvas.width === width && this.canvas.height === height) {
      return false;
    }
    this.canvas.width = width;
    this.canvas.height = height;
    return true;
  }

  render(seconds: number): void {
    if (this.disposed) return;
    const { gl } = this;
    const { width, height } = this.canvas;
    gl.viewport(0, 0, width, height);
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.uniform2f(this.uResolution, width, height);
    gl.uniform1f(this.uTime, seconds);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindVertexArray(null);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    const { gl } = this;
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.useProgram(null);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.buffer);
    gl.deleteProgram(this.program);
    gl.deleteShader(this.vertexShader);
    gl.deleteShader(this.fragmentShader);
    const lose = gl.getExtension(
      "WEBGL_lose_context",
    ) as WEBGL_lose_context | null;
    lose?.loseContext();
  }
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) {
      console.warn("[hero-shader] shader compile failed:", gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

/** Half-resolution render target, capped so retina screens don't melt. */
const RENDER_SCALE = 0.5;
const MAX_DPR = 2;
/** Frame shown when motion is reduced — a settled, non-degenerate moment. */
const STATIC_TIME = 12;

/**
 * Animated WebGL2 cloud field, meant to sit behind the hero as decoration.
 *
 * Renders nothing on the server and nothing on the first client render, so it
 * cannot introduce a hydration mismatch. Bails out silently when WebGL2 is
 * unavailable, paints a single frame under `prefers-reduced-motion: reduce`,
 * and parks the animation loop whenever the section scrolls out of view or the
 * tab is hidden.
 */
export function HeroShader({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = WebGLRenderer.create(canvas);
    if (!renderer) return; // old browser / no WebGL2 — the hero has its own bg

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let elapsed = 0;
    let last = 0;
    let running = false;
    let onScreen = true;
    let contextLost = false;

    const paint = () => {
      renderer.render(motionQuery.matches ? STATIC_TIME : elapsed);
    };

    const frame = (now: number) => {
      elapsed += (now - last) / 1000;
      last = now;
      paint();
      rafRef.current = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const shouldRun = () =>
      onScreen && !document.hidden && !motionQuery.matches && !contextLost;

    const sync = () => {
      if (shouldRun()) {
        if (running) return;
        running = true;
        last = performance.now();
        rafRef.current = requestAnimationFrame(frame);
      } else {
        stop();
      }
    };

    const measure = () => {
      const changed = renderer.resize(
        canvas.clientWidth,
        canvas.clientHeight,
        Math.min(window.devicePixelRatio || 1, MAX_DPR) * RENDER_SCALE,
      );
      // Repaint immediately when parked, otherwise the frame would stay stale.
      if (changed && !running && !contextLost) paint();
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      stop();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(canvas.parentElement ?? canvas);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    const onMotionChange = () => {
      stop();
      paint();
      sync();
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    document.addEventListener("visibilitychange", sync);
    motionQuery.addEventListener("change", onMotionChange);

    measure();
    paint();
    sync();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      document.removeEventListener("visibilitychange", sync);
      motionQuery.removeEventListener("change", onMotionChange);
      renderer.dispose();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 block h-full w-full select-none",
        className,
      )}
    />
  );
}
