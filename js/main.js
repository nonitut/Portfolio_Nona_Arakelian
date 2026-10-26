import * as THREE from 'three';

const canvas = document.querySelector('#heroCanvas');
const stage = document.querySelector('#heroStage');

const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const coarsePointer = window.matchMedia(
  '(pointer: coarse)'
).matches;

function initScene() {
  if (!canvas || !stage) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !coarsePointer,
    powerPreference: 'low-power'
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 3.5;

  // Видео используется как источник кадров, а не как 3D-модель.
  const video = document.createElement('video');
  video.src = 'Non.mp4';
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.loop = false;
  video.crossOrigin = 'anonymous';

  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });

  const aspect = 1992 / 1580; 
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(aspect, 1),
    material
  );

  scene.add(plane);

  let target = 0;
  let current = 0;
  let duration = 0;
  let seeking = false;
  let raf = 0;

  function resize() {
    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.5 : 2)
    );

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Подгоняем плоскость под область сцены без искажения лица.
    const viewHeight = 2 * Math.tan(
      THREE.MathUtils.degToRad(camera.fov / 2)
    ) * camera.position.z;

    const viewWidth = viewHeight * camera.aspect;
    const scale = Math.min(
      viewWidth / aspect,
      viewHeight
    );

    plane.scale.setScalar(scale);
  }

  function onPointerMove(event) {
    if (reduceMotion || !duration) return;

    const rect = stage.getBoundingClientRect();
    const x = THREE.MathUtils.clamp(
      (event.clientX - rect.left) / rect.width,
      0,
      1
    );

    target = x;
  }

  function onPointerLeave() {
    target = 0.5;
  }

  stage.addEventListener('pointermove', onPointerMove, {
    passive: true
  });

  stage.addEventListener('pointerleave', onPointerLeave, {
    passive: true
  });

  function animate() {
    raf = requestAnimationFrame(animate);

    // Плавно следуем за курсором.
    current += (target - current) * 0.12;

    // Перематываем ролик к соответствующему ракурсу.
    if (duration && video.readyState >= 2 && !seeking) {
      // const nextTime = current * Math.max(0, duration - 0.5);
      // const nextTime = (1 - current) * Math.max(1, duration - 0.5);
      // const nextTime = Math.abs(current - 0.1) * 2 * (duration - 0.8);
      const range = duration - 0.3;
      const nextTime = (
        (Math.abs(current - 0.5) * 2.5) % 1
      ) * range;

      if (Math.abs(video.currentTime - nextTime) > 0.025) {
        seeking = true;
        video.currentTime = nextTime;
      }
    }

    renderer.render(scene, camera);
  }

  video.addEventListener('loadedmetadata', () => {
    duration = video.duration;
    resize();
  });

  video.addEventListener('seeked', () => {
    seeking = false;
  });

  video.addEventListener('error', () => {
    console.error(
      'Не удалось загрузить видео головы:',
      video.error
    );
  });

  const observer = new ResizeObserver(resize);
  observer.observe(stage);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      animate();
    }
  });

  resize();
  animate();
}

initScene();


// const canvas = document.querySelector('#heroCanvas');
// const stage = document.querySelector('#heroStage');
// const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

// function initScene() {
//   if (!canvas || !stage) return;
//   const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !coarsePointer, powerPreference: 'low-power' });
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.5 : 2));
//   renderer.setSize(stage.clientWidth, stage.clientHeight, false);
//   renderer.outputColorSpace = THREE.SRGBColorSpace;
//   renderer.setClearColor(0x000000, 0);

//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(34, stage.clientWidth / stage.clientHeight, 0.1, 100);
//   camera.position.z = 7.5;

//   const group = new THREE.Group();
//   scene.add(group);

//   const geometry = new THREE.TorusKnotGeometry(1.15, 0.36, coarsePointer ? 100 : 180, coarsePointer ? 12 : 20, 2, 3);
//   const material = new THREE.MeshPhysicalMaterial({
//     color: 0xb7a7df,
//     metalness: 0.72,
//     roughness: 0.22,
//     clearcoat: 1,
//     clearcoatRoughness: 0.12
//   });
//   const knot = new THREE.Mesh(geometry, material);
//   group.add(knot);

//   const fillGeometry = new THREE.SphereGeometry(0.13, 24, 24);
//   const fillMaterial = new THREE.MeshStandardMaterial({ color: 0x536caa, metalness: 0.35, roughness: 0.28 });
//   const satellite = new THREE.Mesh(fillGeometry, fillMaterial);
//   satellite.position.set(1.9, 1.05, 0.1);
//   group.add(satellite);

//   scene.add(new THREE.HemisphereLight(0xffffff, 0x8d83a9, 2.1));
//   const keyLight = new THREE.DirectionalLight(0xffffff, 3.3);
//   keyLight.position.set(3, 4, 5);
//   scene.add(keyLight);
//   const lilacLight = new THREE.PointLight(0xc3a5ff, 18, 12);
//   lilacLight.position.set(-3, 1, 2);
//   scene.add(lilacLight);
//   const blueLight = new THREE.PointLight(0x7295ff, 12, 10);
//   blueLight.position.set(2, -2, 2);
//   scene.add(blueLight);

//   const pointer = { x: 0, y: 0 };
//   const target = { x: 0, y: 0 };
//   let frame = 0;
//   let running = true;

//   function resize() {
//     const width = Math.max(1, stage.clientWidth);
//     const height = Math.max(1, stage.clientHeight);
//     camera.aspect = width / height;
//     camera.updateProjectionMatrix();
//     renderer.setSize(width, height, false);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.5 : 2));
//   }

//   function onPointerMove(event) {
//     const rect = stage.getBoundingClientRect();
//     target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2.2;
//     target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 1.8;
//   }
//   stage.addEventListener('pointermove', onPointerMove, { passive: true });
//   stage.addEventListener('pointerleave', () => { target.x = 0; target.y = 0; }, { passive: true });

//   // Pointer movement now has a visible impact: stronger tilt, spin and subtle color shift.
//   stage.addEventListener('pointerdown', (event) => {
//     if (event.pointerType === 'touch') {
//       target.x = (Math.random() - 0.5) * 1.8;
//       target.y = (Math.random() - 0.5) * 1.5;
//     }
//   }, { passive: true });

//   function render() {
//     if (!running) return;
//     frame += 0.01;
//     pointer.x += (target.x - pointer.x) * 0.045;
//     pointer.y += (target.y - pointer.y) * 0.045;
//     if (!reduceMotion) {
//       group.rotation.y += (0.0015 + pointer.x * 0.012);
//       group.rotation.x += ((-pointer.y * 0.45) - group.rotation.x) * 0.045;
//       knot.rotation.z = Math.sin(frame * 0.7) * 0.08 + pointer.x * 0.18;
//       satellite.position.y = 1.05 + Math.sin(frame) * 0.15;
//     }
//     renderer.render(scene, camera);
//     requestAnimationFrame(render);
//   }

//   const observer = new ResizeObserver(resize);
//   observer.observe(stage);
//   document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) render(); });
//   resize();
//   render();
// }
// initScene();
