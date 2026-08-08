/**
 * Ambient WebGL backdrop.
 *
 * Lifted out of the two imported HTML files, where the same ~105 lines appeared
 * verbatim in both. THE GLSL BELOW IS UNCHANGED except that the three colour
 * constants now carry the canonical token values — the import's literals had
 * drifted away from ivory / parchment / primary-container.
 *
 * What changed around it:
 *   - compile and link status are actually checked, instead of failing silently
 *     to a blank canvas
 *   - the render loop stops when the tab is hidden or the canvas scrolls out of
 *     view, rather than running forever
 *   - prefers-reduced-motion draws one static frame and never animates
 *   - the u_mouse uniform and its mousemove listener are gone; the fragment
 *     shader never read them
 */
(function () {
  'use strict';

  var canvas = document.getElementById('ambient-shader');
  if (!canvas) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var VERT = [
    'attribute vec2 a_position;',
    'varying vec2 v_texCoord;',
    'void main() {',
    '  v_texCoord = a_position * 0.5 + 0.5;',
    '  gl_Position = vec4(a_position, 0.0, 1.0);',
    '}',
  ].join('\n');

  // vec3 values below are the design tokens, normalised:
  //   ivory             #FCFAF5 -> 0.988, 0.980, 0.961
  //   parchment         #F2EDE4 -> 0.949, 0.929, 0.894
  //   primary-container #c5a059 -> 0.773, 0.627, 0.349
  var FRAG = [
    'precision highp float;',
    'varying vec2 v_texCoord;',
    'uniform float u_time;',
    'uniform vec2 u_resolution;',
    '',
    'void main() {',
    '    vec2 uv = v_texCoord;',
    '',
    '    // Create soft, fluid movement',
    '    float time = u_time * 0.2;',
    '',
    '    // Background color (Ivory/Parchment)',
    '    vec3 color1 = vec3(0.988, 0.980, 0.961); // #FCFAF5 ivory',
    '    vec3 color2 = vec3(0.949, 0.929, 0.894); // #F2EDE4 parchment',
    '    vec3 accent = vec3(0.773, 0.627, 0.349); // #c5a059 primary-container',
    '',
    '    // Dynamic organic shapes',
    '    float noise1 = sin(uv.x * 3.0 + time) * cos(uv.y * 2.0 - time * 1.5);',
    '    float noise2 = sin(uv.y * 4.0 - time * 0.8) * cos(uv.x * 3.0 + time * 1.2);',
    '',
    '    float mask = smoothstep(0.4, 0.6, 0.5 + 0.5 * (noise1 + noise2));',
    '',
    '    vec3 finalColor = mix(color1, color2, mask);',
    '',
    '    // Add a very subtle gold shimmer',
    '    float shimmer = pow(max(0.0, sin(uv.x * 10.0 + uv.y * 5.0 + time * 2.0)), 20.0);',
    '    finalColor = mix(finalColor, accent, shimmer * 0.05);',
    '',
    '    gl_FragColor = vec4(finalColor, 1.0);',
    '}',
  ].join('\n');

  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return; // No WebGL: the page keeps its flat token background.

  function compile(type, src) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('[shader] compile failed:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  var program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[shader] link failed:', gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  var aPosition = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  var uTime = gl.getUniformLocation(program, 'u_time');
  var uResolution = gl.getUniformLocation(program, 'u_resolution');

  function syncSize() {
    // Cap the drawing buffer at 1x. The backdrop is a soft gradient at 30%
    // opacity; rendering it at retina density costs fill rate for nothing.
    var w = canvas.clientWidth || 1280;
    var h = canvas.clientHeight || 720;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(syncSize).observe(canvas);
  syncSize();

  function draw(timeMs) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uTime) gl.uniform1f(uTime, timeMs * 0.001);
    if (uResolution) gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  var frame = null;
  var onScreen = true;

  function loop(t) {
    draw(t);
    frame = requestAnimationFrame(loop);
  }

  function start() {
    if (frame !== null) return;
    if (reduceMotion.matches) { draw(0); return; }
    if (!onScreen || document.hidden) return;
    frame = requestAnimationFrame(loop);
  }

  function stop() {
    if (frame === null) return;
    cancelAnimationFrame(frame);
    frame = null;
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });

  if (typeof IntersectionObserver !== 'undefined') {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) start();
      else stop();
    }).observe(canvas);
  }

  // Respond live if the user flips the OS setting mid-session.
  var onMotionChange = function () {
    stop();
    start();
  };
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onMotionChange);
  else if (reduceMotion.addListener) reduceMotion.addListener(onMotionChange);

  start();
})();
