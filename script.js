import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

let [width, height] = [window.innerWidth, window.innerHeight];

const canvas = document.getElementById('canvas');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 10;
camera.position.y = 6;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(width, height);

const gltfLoader = new GLTFLoader();
gltfLoader.load('static/rain_shower_head/scene.gltf', (gltf) => {
  gltf.scene.scale.set(3, 3, 3);
  gltf.scene.rotation.set(2, 0, 9.4);
  gltf.scene.position.set(0, 6, -4);
  scene.add(gltf.scene);
});

const textureLoader = new THREE.TextureLoader();
const wallTexture = textureLoader.load(
  'https://cdn.polyhaven.com/asset_img/primary/brick_wall_10.png?height=720'
);
const floorTexture = textureLoader.load(
  'https://cdn.polyhaven.com/asset_img/primary/marble_01.png?height=720'
);

wallTexture.colorSpace = THREE.SRGBColorSpace;
floorTexture.colorSpace = THREE.SRGBColorSpace;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 10, 20),
  new THREE.MeshStandardMaterial({ map: floorTexture })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const wall = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 8, 10),
  new THREE.MeshStandardMaterial({ map: wallTexture })
);
wall.position.z = -4.5;
wall.position.y = 3;
scene.add(wall);

const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const particleCount = 500;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] = Math.random() * 10;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
  color: 0xffffff,
});

const particleSystem = new THREE.Points(particles, particleMaterial);
particleSystem.position.set(0, 5.8, -3.5);
particleSystem.scale.set(0.14, 0.14, 0.14);
particleSystem.rotation.x = -1.2;
particleSystem.position.set(0, 5.4, -2.6);
scene.add(particleSystem);

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const positions = particleSystem.geometry.attributes.position.array;

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 1] -= 0.1;

    if (positions[i * 3 + 1] < 0) {
      positions[i * 3 + 1] = 0;

      setTimeout(() => {
        positions[i * 3 + 1] = 10;
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }, 100);
    }
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

console.log('updateSomething');
