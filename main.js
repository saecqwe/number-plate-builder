import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js';
import { PlateItem } from './PlateItem.js'; // Adjust the path based on where your files are located



const plateForm = document.getElementById('plate-form');
const summaryDiv = document.getElementById('summary');

// Create a new plate item
let plateItem = new PlateItem();

plateForm.addEventListener('change', (event) => {
  const target = event.target;

  // Update model based on form changes
  switch (target.id) {
    case 'registration':
      plateItem.setRegistration(target.value);
      break;
    case 'roadLegal':
      plateItem.toggleRoadLegal(target.checked);
      break;
    case 'front-plate-style':
      plateItem.setFrontPlate(target.value, plateForm['front-plate-size'].value);
      break;
    case 'front-plate-size':
      plateItem.setFrontPlate(plateForm['front-plate-style'].value, target.value);
      break;
    case 'rear-plate-style':
      plateItem.setRearPlate(target.value, plateForm['rear-plate-size'].value);
      break;
    case 'rear-plate-size':
      plateItem.setRearPlate(plateForm['rear-plate-style'].value, target.value);
      break;
    case 'border':
      console.log('borderrr case : ' + target.checked);
      plateItem.addBorder(target.checked ? 'Black Border' : null);
      break;
    case 'badge':
      plateItem.addBadge(target.checked ? 'GB Badge' : null);
      break;
  }
});

document.getElementById('calculate-total').addEventListener('click', () => {
  plateItem.calculatePrice();
  displaySummary();
});

function displaySummary() {
  const summary = plateItem.getSummary();
  summaryDiv.innerHTML = `
    <p>Registration: ${summary.registration}</p>
    <p>Road Legal: ${summary.roadLegal}</p>
    <p>Front Plate: ${summary.frontPlate.style}, ${summary.frontPlate.size}</p>
    <p>Rear Plate: ${summary.rearPlate.style}, ${summary.rearPlate.size}</p>
    <p>Border: ${summary.frontPlate.border || 'None'}</p>
    <p>Badge: ${summary.rearPlate.border || 'None'}</p>
    <p>Total Price: £${summary.totalPrice.toFixed(2)}</p>
  `;
}




// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const plateWidthMeters = 520 / 80; // 520mm to meters
const plateHeightMeters = 110 / 80; 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
// document.body.appendChild(renderer.domElement);

// Add ambient lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Create plate geometry (a double-sided plane)
const plateGeometry = new THREE.PlaneGeometry(plateWidthMeters, plateHeightMeters, 1);
const plateMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff  , side:THREE.DoubleSide} );
const plate = new THREE.Mesh(plateGeometry, plateMaterial);
scene.add(plate);

// Add text to the number plate
let plateTextMesh;
const fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  const textGeometry = new THREE.TextGeometry('Your Text', {
    font: font,
    size: 0.4,
    height: 0.05,
  });

  const textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
  plateTextMesh = new THREE.Mesh(textGeometry, textMaterial);
  plateTextMesh.position.set(-1.5, 0, 0.05); // Adjust z-position for better placement
  scene.add(plateTextMesh);
});

// Add a default logo texture
let logoMesh;
const logoTexture = new THREE.TextureLoader().load('/path-to-logo/default-logo.png');
const logoGeometry = new THREE.PlaneGeometry(0.8, 0.8);
const logoMaterial = new THREE.MeshPhongMaterial({ map: logoTexture, transparent: true });
logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
logoMesh.position.set(1.5, 0, 0.05); // Adjust z-position for better placement
scene.add(logoMesh);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);

// Handle text input change
const textInput = document.getElementById('plateText');
textInput.addEventListener('input', (event) => {
  const newText = event.target.value;

  if (plateTextMesh) {
    scene.remove(plateTextMesh);
  }

  fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new THREE.TextGeometry(newText || 'Your Text', {
      font: font,
      size: 0.7,
      height: 0.05,
    });

    const textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    plateTextMesh = new THREE.Mesh(textGeometry, textMaterial);
    plateTextMesh.position.set(-1.5, -0.36, 0.05); // Adjust z-position for better placement
    scene.add(plateTextMesh);
  });
});



// Handle logo input change
const logoInput = document.getElementById('logoInput');
logoInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const logoTexture = new THREE.TextureLoader().load(e.target.result);
      logoMesh.material.map = logoTexture;
      logoMesh.material.needsUpdate = true;
    };
    reader.readAsDataURL(file);
  }
});

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Adjust the renderer size when the window is resized
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});