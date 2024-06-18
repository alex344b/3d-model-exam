//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = '4090';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "4090" ? 500 : 500;

//Add lights to the scene, so we can actually see the 3D model
const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

//adds top light to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 8); // (color, intensity)
topLight.position.set(50, 50, 50) //top-left-ish
 topLight.castShadow = true;
scene.add(topLight);
//creates ambient lighting to the scene
const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "4090" ? 5 : 1);
scene.add(ambientLight);

//adds stars to the field, to make it look like space
function addStar() {
  const geometry = new THREE.SphereGeometry(1, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(950));
  star.position.set(x, y, z);
  scene.add(star)
}
Array(900).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('image.png');
scene.background = spaceTexture;

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "4090") {
  controls = new OrbitControls(camera, renderer.domElement);
}

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  
  const time = performance.now() * 0.0001;
  const radius = 500;

  // Update camera position to rotate horizontally around the origin
  camera.position.x = Math.sin(time) * radius;
  camera.position.z = Math.cos(time) * radius;

  object.rotation.y += 0.004;

  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//Start the 3D rendering
animate();