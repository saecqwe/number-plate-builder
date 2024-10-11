import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js';
import { PlateItem } from './PlateItem.js'; // Adjust the path based on where your files are located




// Select the form element
const plateForm = document.querySelector('.form form');
var textGeometry;
// Select the summary div (you might need to add a class or id to this div in your HTML)
const summaryDiv = document.getElementById('summary');
var text;

// Create a new plate item
let plateItem = new PlateItem();

// Select the option menu
const optionMenu = document.getElementById('option-menu');

// Select the options container
const optionsContainer = document.getElementById('options-container');

// Define your styles, sizes, and finishes
const styles = [
  { name: '3mm', image: 'https://aplates.co.uk/wp-content/uploads/2023/09/4D-3mm-Main-Image-Pair-Web-v2-white-640x360.jpg' },
  { name: '5mm', image: 'https://aplates.co.uk/wp-content/uploads/2023/09/4D-3mm-Main-Image-Pair-Web-v2-white-640x360.jpg' },
  // Add more styles as needed
];

const sizes = [
  { name: 'Small', image: 'https://aplates.co.uk/wp-content/uploads/2023/07/4D-Gel-5mm-18-Rear-Web-white-640x360.jpg' },
  { name: 'Medium', image: 'https://aplates.co.uk/wp-content/uploads/2023/06/4D-3MM-Standard-20-with-black-border-Front-Main-Image-white-640x360.jpg' },
  // Add more sizes as needed
];
// Event listener for clicks on the option menu
optionMenu.addEventListener('click', (event) => {
  // Prevent default link behavior
  event.preventDefault();
  
  // Check if the clicked element is a link
  if (event.target.tagName === 'A') {
    const type = event.target.getAttribute('data-type');
  console.log(type);

    // Only trigger change for "style" or "size"
    if (type === 'style' || type === 'size') {
      // Create an event to trigger
      const changeEvent = new Event('change');
      let inputField;

      displayOptions(type);
      // Determine which input field to update
      // if (type === 'style') {
      //   inputField = document.getElementById('style-input'); // Update with the actual ID for style
      //   inputField.value = 'selectedStyle'; // Set your selected style value
      // } else if (type === 'size') {
      //   inputField = document.getElementById('size-input'); // Update with the actual ID for size
      //   inputField.value = 'selectedSize'; // Set your selected size value
      // }

      // // Trigger the change event if inputField is defined
      // if (inputField) {
      //   inputField.dispatchEvent(changeEvent); // Trigger change event
      // }
    }
    
  }
});








// Event listener for form changes
plateForm.addEventListener('change', (event) => {
  const target = event.target;
console.log(target.value);
  // Update model based on form changes
  switch (target.id) {
    
    case 'registration':
      plateItem.setRegistration(target.value);
      text = target.value;
      updatePlateText(target.value);
      break;
    case 'character-spacing-toggle':
      plateItem.characterSpacing;
      break;
    case 'character-spacing-toggle':
      plateItem.toggleRoadLegality(target.checked);
      break;
    case 'front-plate-toggle':
      plateItem.setFrontPlate(target.checked ? 'Standard' : null, null);
      break;
    case 'rear-plate-toggle':
      plateItem.setRearPlate(target.checked ? 'Standard' : null, null);
      break;
    case 'style-select':
      displayOptions('style');
      break;
    case 'size-select':
      displayOptions('size');
      break;
    // Add more cases if you have additional inputs
  }
});

// Event listener for form submission
plateForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission
  plateItem.calculatePrice();
  displaySummary();
});


// Example function to display options based on the type selected
function displayOptions(type) {
  optionsContainer.innerHTML = ''; // Clear previous options
  let options;

  if (type === 'style') {
    options = styles;
  } else if (type === 'size') {
    options = sizes;
  } else {
    return; // Exit if type is not recognized
  }

  options.forEach(option => {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('option-item');
    
    const img = document.createElement('img');
    img.src = option.image;
    img.alt = option.name;
    img.style.width = '100px'; // Adjust the size as needed

    const label = document.createElement('label');
    label.innerText = option.name;

    
    optionDiv.appendChild(label);

    optionDiv.appendChild(img);
    optionsContainer.appendChild(optionDiv);
    
    // Optionally add an event listener for selection
    optionDiv.addEventListener('click', () => {
      // Handle option selection
      if(option.name == 'Small')
      {
        
        updatePlateGeometry(250/100,70/100);

      }
       if(option.name == 'Medium')
      {
        updatePlateGeometry(plateWidthMeters,plateHeightMeters);
      }
      console.log(`Selected ${option.name}`);
      // You can set this value to the plateItem or trigger other actions
      if(option.name == '3mm')
      {
        console.log(3)
        updatePlatNumberSize(3);

      }
      if(option.name == '5mm')
      {
        console.log(5)

        updatePlatNumberSize(5);
      }
   
    });
  });
}


// Function to display the summary
function displaySummary() {
  const summary = plateItem.getSummary();
  summaryDiv.innerHTML = `
    <h2>Your Plates</h2>
    <div>
      <div>Registration: ${summary.registration}</div>
      <div>Road Legal: ${summary.roadLegal}</div>
    </div>
    <h3>Front Plate</h3>
    <div>
      <div>Style: ${summary.frontPlate.style || 'None'}</div>
      <div>Size: ${summary.frontPlate.size || 'Default'}</div>
      <div>Border: ${summary.frontPlate.border || 'None'}</div>
      <div>Badge: ${summary.frontPlate.badge || 'None'}</div>
    </div>
    <h3>Rear Plate</h3>
    <div>
      <div>Style: ${summary.rearPlate.style || 'None'}</div>
      <div>Size: ${summary.rearPlate.size || 'Default'}</div>
      <div>Border: ${summary.rearPlate.border || 'None'}</div>
      <div>Badge: ${summary.rearPlate.badge || 'None'}</div>
    </div>
    <div>Total Price: £${summary.totalPrice.toFixed(2)}</div>
  `;
}

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 2);
const plateWidthMeters = 340 / 100; // Convert mm to meters
const plateHeightMeters = 70 / 100;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);
renderer.setClearColor(0xffffff, 1); // 0xffffff is white, 1 is full opacity

// Add two "sun" reflection spots using PointLights at specific positions
// Reflection 1 at 30% width and 17% height
const reflection1 = new THREE.PointLight(0xffffff, 0.6, 0.1); // Bright but limited in range
reflection1.position.set(plateWidthMeters * 0.3, plateHeightMeters * 0.34, 0.02); // Position slightly above the plate surface
scene.add(reflection1);

// Reflection 2 at 30% width and 70% height
const reflection2 = new THREE.PointLight(0xffffff, 0.6, 0.1); // Another reflection spot
reflection2.position.set(plateWidthMeters * 0.1, plateHeightMeters * 0.001, 0.02); // Lower spot on the plate
scene.add(reflection2);
// Append renderer to the div with id '3d-scene'
document.getElementById('3d-scene').appendChild(renderer.domElement);

// Add ambient lighting
const ambientLight = new THREE.AmbientLight(0xffffcd29, 1);
scene.add(ambientLight);

// Create plate geometry (a double-sided plane)
const plateGeometry = new THREE.BoxGeometry(plateWidthMeters, plateHeightMeters,0.1);
const plateMaterial = new THREE.MeshPhongMaterial({
  color: 0xfff0f0f0,
  side: THREE.FrontSide, 
});



var plate = new THREE.Mesh(plateGeometry, plateMaterial);
var textMaterial;
scene.add(plate);

// Add text to the number plate
let plateTextMesh;
const fontLoader = new THREE.FontLoader();

function updatePlateText(text) {
  if (plateTextMesh) {
    scene.remove(plateTextMesh);
  }
  fontLoader.load(
    'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', // Use the bold font
    function (font) {
         textGeometry = new THREE.TextGeometry(text || 'YOUR REG', {
            font: font,
            size: 0.3555,
            height: 0.01, // Increase height for thickness
            bevelEnabled: true, // Enable bevel
            bevelThickness: 0.06, // Thickness of the bevel
            bevelSize: 0.00005, // Size of the bevel
        });

         textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 , side: THREE.FrontSide, });
        plateTextMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Center the text
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        plateTextMesh.position.set(-textWidth / 2, -0.2, 0.1);
        scene.add(plateTextMesh);
    }
);

}

function updatePlatNumberSize( thickness ) {

  scene.remove(plateTextMesh);

  fontLoader.load(
    'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', // Use the bold font
    function (font) {
         textGeometry = new THREE.TextGeometry(text || 'YOUR REG', {
            font: font,
            size: 0.3555,
            height: 0.01, // Increase height for thickness
            bevelEnabled: true, // Enable bevel
            bevelThickness: (thickness) /180, // Thickness of the bevel
            bevelSize: 0.00005, // Size of the bevel
        });

         textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 , side: THREE.FrontSide});
        plateTextMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Center the text
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        plateTextMesh.position.set(-textWidth / 2, -0.2, 0.1);
        scene.add(plateTextMesh);
    }
);
}
// Function to update the plate geometry
function updatePlateGeometry(newWidth, newHeight) {
  // Remove the old plate mesh
  scene.remove(plate);

  
  // Create new geometry with updated width and height
  const newPlateGeometry = new THREE.BoxGeometry((newWidth), plateHeightMeters,0.017);

  // Create new plate mesh with updated geometry but same material
   plate = new THREE.Mesh(newPlateGeometry, plateMaterial);

  // Add the updated plate back to the scene
  scene.add(plate);
}

// Example usage: Change geometry after 2 seconds



// Initialize with default text
updatePlateText('YOUR REG');

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Adjust the renderer size when the window is resized
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
