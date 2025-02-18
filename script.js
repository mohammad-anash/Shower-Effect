import * as THREE from 'three';
import { OrbitControls, ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

let [width, height] = [window.innerWidth, window.innerHeight];

const canvas = document.getElementById('canvas');

const gltf = new GLTFLoader();
gltf.load('static/rain_shower_head/scene.gltf', (gltf) => {
  gltf.scene.scale.set(4, 4, 4);
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
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, width / height);
camera.position.z = 10;
camera.position.y = 6;

scene.add(camera);

window.addEventListener('resize', (event) => {
  width = window.innerWidth;
  height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const ambeinLight = new THREE.AmbientLight('white', 1);
scene.add(ambeinLight);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 10, 20),
  new THREE.MeshStandardMaterial({
    map: floorTexture,
  })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const wall = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 8, 10),
  new THREE.MeshStandardMaterial({
    map: wallTexture,
  })
);
wall.position.z = -4.5;
wall.position.y = 3;
scene.add(wall);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(width, height);

const tick = () => {
  controls.update();

  window.requestAnimationFrame(tick);
  renderer.render(scene, camera);
};

tick();
