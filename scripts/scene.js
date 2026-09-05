import * as THREE from '../vendor/three.module.min.js';

/** A deliberately small, procedural field. No model downloads or perpetual animation. */
export function createFieldScene(canvas, container) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 4, -4, 0.1, 70);
  camera.position.set(8, 7.5, 10);
  camera.lookAt(0, 0.4, 0);
  scene.add(new THREE.HemisphereLight(0xf5f5d6, 0x334737, 2.6));
  const sun = new THREE.DirectionalLight(0xfff3ce, 3);
  sun.position.set(-4, 7, 5);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xb3d9c0, 1.8);
  rim.position.set(5, 3, -5);
  scene.add(rim);
  const field = new THREE.Group();
  scene.add(field);
  field.rotation.y = -0.13;
  const materials = [];
  const mat = (color, extra = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra });
    materials.push(m);
    return m;
  };
  const soil = mat(0x725037),
    soilLight = mat(0xa07c50),
    soilDark = mat(0x483d2b),
    grass = mat(0x65784a),
    metal = mat(0xd6dbcd, { metalness: 0.55, roughness: 0.4 }),
    black = mat(0x25362b),
    gold = mat(0xe9ac69);
  const mesh = (geometry, material, x, y, z, parent = field) => {
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(x, y, z);
    parent.add(obj);
    return obj;
  };
  const box = (w, h, d, m, x, y, z, p = field) =>
    mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
  box(5.9, 0.32, 4.2, soilDark, 0, -0.77, 0);
  box(5.9, 0.22, 4.2, soilLight, 0, -0.5, 0);
  box(5.9, 0.5, 4.2, soil, 0, -0.15, 0);
  box(5.9, 0.07, 4.2, grass, 0, 0.13, 0);
  // Furrows and rows of low-poly cotton plants.
  const leafMats = [mat(0x748b45), mat(0x8ba35a), mat(0xa6b96d), mat(0x526d36)];
  const leafGeo = new THREE.IcosahedronGeometry(0.18, 0);
  const stemGeo = new THREE.CylinderGeometry(0.018, 0.025, 0.34, 5);
  const stemMat = mat(0x697244);
  for (let r = 0; r < 8; r++) {
    const x = -2.48 + r * 0.7;
    box(0.24, 0.035, 3.9, soilDark, x, 0.18, 0);
    for (let c = 0; c < 10; c++) {
      const z = -1.75 + c * 0.39,
        h = 0.15 + Math.sin(r * 5 + c * 3) * 0.04;
      mesh(stemGeo, stemMat, x, 0.33, z);
      const l = mesh(leafGeo, leafMats[(r + c) % 4], x - 0.08, 0.43 + h, z);
      l.scale.set(1.2, 0.7, 0.9);
      l.rotation.z = 0.4;
      const rr = mesh(leafGeo, leafMats[(r + c + 1) % 4], x + 0.1, 0.38 + h, z + 0.03);
      rr.scale.set(1.1, 0.65, 1);
      rr.rotation.z = -0.3;
      mesh(leafGeo, leafMats[(r + c + 2) % 4], x, 0.53 + h, z - 0.03).scale.set(0.8, 0.8, 0.8);
    }
  }
  // A freestanding IRT mast, logger enclosure, and solar panel.
  mesh(new THREE.CylinderGeometry(0.036, 0.036, 2.7, 10), metal, 0.7, 1.43, 0.1);
  box(1.15, 0.055, 0.055, metal, 0.15, 2.76, 0.1);
  const irt = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.28, 12), metal, -0.43, 2.64, 0.1);
  irt.rotation.z = 0.35;
  mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 12), black, -0.48, 2.5, 0.1).rotation.z = 0.35;
  box(0.39, 0.48, 0.16, metal, 0.7, 1.49, 0.2);
  box(0.26, 0.2, 0.02, black, 0.7, 1.53, 0.29);
  const panel = box(0.6, 0.035, 0.45, black, 0.72, 2.02, 0.2);
  panel.rotation.z = -0.22;
  for (let n = 0; n < 4; n++)
    box(0.004, 0.009, 0.42, metal, 0.48 + n * 0.14, 2.07, 0.2).rotation.z = -0.22;
  // Rain gauge with a small funnel.
  mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.28, 8), metal, 2.25, 0.81, 1.38);
  mesh(new THREE.CylinderGeometry(0.19, 0.09, 0.25, 14), metal, 2.25, 1.53, 1.38);
  mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.01, 14), black, 2.25, 1.66, 1.38);
  box(0.24, 0.33, 0.15, gold, 2.25, 0.85, 1.48);
  // Visible cross-section probe, with depth markers.
  const waterGroup = new THREE.Group();
  field.add(waterGroup);
  const waterMat = mat(0x81b6c1, { transparent: true, opacity: 0.8 });
  mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.12, 8), waterMat, -1.95, -0.28, 2.14, waterGroup);
  for (let i = 0; i < 4; i++)
    box(0.15, 0.018, 0.06, waterMat, -1.95, 0.12 - i * 0.22, 2.14, waterGroup);
  // Root-zone lines are schematic and decorative, never a measurement.
  const rootMaterial = new THREE.LineBasicMaterial({
    color: 0xd8caa0,
    transparent: true,
    opacity: 0.4,
  });
  for (let r = 0; r < 8; r++) {
    const x = -2.48 + r * 0.7;
    for (let i = 0; i < 3; i++) {
      const points = [
        new THREE.Vector3(x, 0.1, 2.11),
        new THREE.Vector3(x + (i - 1) * 0.12, -0.25, 2.12),
        new THREE.Vector3(x + (i - 1) * 0.26, -0.58, 2.12),
      ];
      field.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), rootMaterial));
    }
  }
  const scanMaterial = new THREE.MeshBasicMaterial({
    color: 0xd9e9a4,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const scan = mesh(new THREE.ConeGeometry(0.65, 1.7, 32, 1, true), scanMaterial, -0.43, 1.63, 0.1);
  const disk = mesh(
    new THREE.CircleGeometry(0.65, 40),
    new THREE.MeshBasicMaterial({
      color: 0xd7e29d,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    -0.43,
    0.79,
    0.1,
  );
  disk.rotation.x = -Math.PI / 2;
  const waterPlane = mesh(
    new THREE.PlaneGeometry(5.92, 4.22),
    new THREE.MeshBasicMaterial({
      color: 0x83b3c1,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    0,
    -0.4,
    0,
  );
  waterPlane.rotation.x = -Math.PI / 2;
  waterPlane.visible = false;
  const dataGroup = new THREE.Group();
  field.add(dataGroup);
  for (let i = 0; i < 3; i++) {
    const ring = mesh(
      new THREE.TorusGeometry(0.18 + i * 0.14, 0.008, 6, 40, Math.PI * 1.55),
      gold,
      0.72,
      3.02,
      0.1,
      dataGroup,
    );
    ring.rotation.z = -0.78;
  }
  dataGroup.visible = false;
  const perimeter = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.5, -1.05, -2.7),
      new THREE.Vector3(3.5, -1.05, -2.7),
      new THREE.Vector3(3.5, -1.05, 2.7),
      new THREE.Vector3(-3.5, -1.05, 2.7),
    ]),
    new THREE.LineBasicMaterial({ color: 0x8d9e75, transparent: true, opacity: 0.25 }),
  );
  scene.add(perimeter);
  let isVisible = true,
    frame = 0,
    target = -0.13;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function render() {
    frame = 0;
    if (!isVisible || document.hidden) return;
    renderer.render(scene, camera);
  }
  function requestRender() {
    if (!frame && isVisible && !document.hidden) frame = requestAnimationFrame(render);
  }
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    const aspect = width / height,
      span = 4.05;
    camera.left = -span * aspect;
    camera.right = span * aspect;
    camera.top = span;
    camera.bottom = -span;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    requestRender();
  }
  new ResizeObserver(resize).observe(container);
  new IntersectionObserver(
    (entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) requestRender();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { threshold: 0.01 },
  ).observe(container);
  document.addEventListener('visibilitychange', requestRender);
  container.addEventListener(
    'pointermove',
    (event) => {
      if (motion.matches || event.pointerType === 'touch') return;
      const r = container.getBoundingClientRect();
      target = -0.13 + ((event.clientX - r.left) / r.width - 0.5) * 0.32;
      field.rotation.y = target;
      requestRender();
    },
    { passive: true },
  );
  container.addEventListener('pointerleave', () => {
    field.rotation.y = -0.13;
    requestRender();
  });
  motion.addEventListener('change', () => {
    canvas.classList.toggle('ready', !motion.matches);
    if (!motion.matches) requestRender();
  });
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    canvas.classList.remove('ready');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    resize();
    canvas.classList.add('ready');
  });
  resize();
  renderer.render(scene, camera);
  canvas.classList.add('ready');
  return {
    setLayer(layer) {
      scan.visible = layer === 'canopy';
      disk.visible = layer === 'canopy';
      waterPlane.visible = layer === 'water';
      waterMat.emissive.set(layer === 'water' ? 0x3f6b7a : 0x000000);
      dataGroup.visible = layer === 'data';
      soil.transparent = layer === 'water';
      soil.opacity = layer === 'water' ? 0.6 : 1;
      soil.needsUpdate = true;
      requestRender();
    },
  };
}
