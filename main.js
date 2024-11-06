import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js';
import { PlateItem } from './PlateItem.js'; // Adjust the path based on where your files are located


var borderr;

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

const border = [
  {name :'4D 3mm border' , image : 'https://aplates.co.uk/wp-content/uploads/2023/08/4D-3mm-Border-white-640x360.jpg'} , 
  {name:'4D 5mm border' , image : 'https://aplates.co.uk/wp-content/uploads/2023/08/4D-5mm-Border-white-640x360.jpg'}
]


const sizes = [
  { name: 'Small', image: 'https://aplates.co.uk/wp-content/uploads/2023/07/4D-Gel-5mm-18-Rear-Web-white-640x360.jpg' },
  { name: 'Medium', image: 'https://aplates.co.uk/wp-content/uploads/2023/06/4D-3MM-Standard-20-with-black-border-Front-Main-Image-white-640x360.jpg' },
  // Add more sizes as needed
];

const tabs = document.querySelectorAll('.k-pb__tab');

  // Function to handle tab selection
  function selectTab(event) {
    // Set aria-selected to "false" for all tabs
    tabs.forEach(tab => tab.setAttribute('aria-selected', 'false'));

    // Set aria-selected to "true" for the clicked tab
    event.currentTarget.setAttribute('aria-selected', 'true');
  }

  // Add event listeners to each tab
  tabs.forEach(tab => tab.addEventListener('click', selectTab));
// Event listener for clicks on the option menu
optionMenu.addEventListener('click', (event) => {
  // Prevent default link behavior
  event.preventDefault();
  
  // Check if the clicked element is a link
  if (event.target.tagName === 'A') {
    const type = event.target.getAttribute('data-type');
  console.log(type);

  document.querySelectorAll('#option-menu a').forEach(item => {
    item.classList.remove('selected');
  });

  // Add 'selected' class to the clicked item
  event.target.classList.add('selected');

    // Only trigger change for "style" or "size"
    if (type === 'style' || type === 'size' || type ==='border' || type === 'start') {
      // Create an event to trigger
      const changeEvent = new Event('change');
      let inputField;
console.log("going to starttt");
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
      if(target.value.length <= 8)
      {
        plateItem.setRegistration(target.value);
        text = target.value;
        updatePlateText(target.value);
      }
      else
      {
    var  errorDiv  =   document.getElementById("plateError")
      errorDiv.classList.remove('hidden');
        console.log("number plate tooo long");
      }
    
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
  }
  else if(type ==='border')
  {
    options = border;
  }
  else if(type==='start')
  {
    console.log("this is triggering");
    const innerHTMLContent = `
    <label for="registration">Your registration</label>
    <input type="text" id="registration" placeholder="YOUR REG" maxlength="15"
        autocomplete="off" autocorrect="on" autocapitalize="off" spellcheck="false">
    <div id="plateError" class="hidden" style="color: white; background-color: #c70808;">
        Plate number too long
    </div>
    <div>Formatted as <strong>222 B</strong></div>
    <div>
        <label for="character-spacing-toggle">Character Spacing</label>
        <div class="toggle-container">
            <input type="checkbox" id="character-spacing-toggle" class="toggle-input" checked>
            <label for="character-spacing-toggle" class="toggle-label">Using road legal spacing</label>
        </div>
    </div>
    <div>
        <label for="front-plate-toggle">Front Plate</label>
        <div class="toggle-container">
            <input type="checkbox" id="front-plate-toggle" class="toggle-input" checked>
            <label for="front-plate-toggle" class="toggle-label">I want a front plate</label>
        </div>
    </div>
    <div>
        <label for="rear-plate-toggle">Rear Plate</label>
        <div class="toggle-container">
            <input type="checkbox" id="rear-plate-toggle" class="toggle-input" checked>
            <label for="rear-plate-toggle" class="toggle-label">I want a rear plate</label>
        </div>
    </div>
`;

// Set the inner HTML of your desired element
optionsContainer.innerHTML = innerHTMLContent;

console.log(optionsContainer.innerHTML);
options = [];
  }
  
  else {
   return ;
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
console.log("abdullahh " + option.name)
  

      if(option.name === "4D 3mm border")
      { 
        var namee = option.name;
        console.log("this is option :::: " + namee);

        updateTextBorder(namee,plateTextMesh);

      }
      if(option.name === "4D 5mm border")
      { 
        var namee = option.name;
        console.log("this is option :::: " + namee);

        updateTextBorder(namee,plateTextMesh);

      }

      if(option.name == 'Small')
      {
        
        updatePlateGeometry(plateWidthMeters,plateHeightMeters);

      }
       if(option.name == 'Medium')
      {
        updatePlateGeometry(plateWidthMeters+1,plateHeightMeters);
      }
      console.log(`Selected ${option.name}`);
      // You can set this value to the plateItem or trigger other actions
      if(option.name == '4D 3mm')
      {
        updatePlatNumberSize(3);
        console.log(5)


      } 
      if(option.name == '4D 5mm')
      {
        console.log(5)

        updatePlatNumberSize(5);
      }
   
    });
  });
}

function updateTextBorder(option, textMesh) {
  // Ensure userData exists
  if (!textMesh.userData) {
      textMesh.userData = {};
  }

  // Remove any existing border mesh if needed
  if (textMesh.userData.borderMesh) {
      textMesh.remove(textMesh.userData.borderMesh);
  }

  // Define border properties based on the option
  let borderThickness = 0.01; // Adjust for visibility
  let borderColor = 0x000000; // Default black color

  // Set properties for each option
  console.log("this is case " + option);
  switch (option) {
      case "4D 5mm border":
          borderThickness = 0.1; // 5mm scale in your 3D units
          break;
      case "4D 3mm border":
          borderThickness = 0.15; // Adjusted for visibility
          break;
      case "Black Printed":
          borderThickness = 0.01; // Default thickness
          break;
      case "Red Printed":
          borderThickness = 0.01; // Default thickness
          borderColor = 0xff0000;
          break;
      default:
          return; // No border for other options
  }

  // Calculate the bounding box of the text mesh
  const borderMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.3,
    metalness: 0.1,
  });
  
  // Define a shape for the border with a hole inside
  const shape = new THREE.Shape();
  const width = plateGeometry.parameters.width-0.1    ;
  const height = plateGeometry.parameters.height-0.1;
  
  // Outer rectangle (border)
  shape.moveTo(-width / 2 - 0.015, -height / 2 - 0.015);
  shape.lineTo(width / 2 + 0.015, -height / 2 - 0.015);
  shape.lineTo(width / 2 + 0.015, height / 2 + 0.015);
  shape.lineTo(-width / 2 - 0.015, height / 2 + 0.015);
  shape.lineTo(-width / 2 - 0.015, -height / 2 - 0.015);
  
  // Inner rectangle (cutout for the plate)
  const hole = new THREE.Path();
  hole.moveTo(-width / 2, -height / 2);
  hole.lineTo(width / 2, -height / 2);
  hole.lineTo(width / 2, height / 2);
  hole.lineTo(-width / 2, height / 2);
  hole.lineTo(-width / 2, -height / 2);
  shape.holes.push(hole);
  
  // Extrude the shape to give it some depth
  const extrudeSettings = {
    depth: borderThickness, // Increased depth for better visibility
    bevelEnabled: false,
  };
  const borderGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  
  // Create the border mesh
   borderr = new THREE.Mesh(borderGeometry, borderMaterial);
  
  // Position the border slightly in front of the plate
  borderr.position.copy(plate.position);
  borderr.position.z += 0.005; // Adjust as needed to align with the front
  scene.add(borderr);
}



function box( width, height, depth ) {

  width = width * 0.5,
  height = height * 0.5,
  depth = depth * 0.5;

  const geometry = new THREE.BufferGeometry();
  const position = [];

  position.push(
    - width, - height, - depth,
    - width, height, - depth,

    - width, height, - depth,
    width, height, - depth,

    width, height, - depth,
    width, - height, - depth,

    width, - height, - depth,
    - width, - height, - depth,

    - width, - height, depth,
    - width, height, depth,

    - width, height, depth,
    width, height, depth,

    width, height, depth,
    width, - height, depth,

    width, - height, depth,
    - width, - height, depth,

    - width, - height, - depth,
    - width, - height, depth,

    - width, height, - depth,
    - width, height, depth,

    width, height, - depth,
    width, height, depth,

    width, - height, - depth,
    width, - height, depth
   );
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
  100,
  1,
  0.2,
  2000 
);
// Define colors for front and rear plates
const frontPlateColor = 0xffffff; // White for front plate
const rearPlateColor = 0xffff00;  // Yellow for rear plate

// Create the material for the plate


camera.position.set(0, 0, 3);
const plateWidthMeters = 4.2; // Adjust width
const plateHeightMeters = 2.2; // Adjust height



const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);
renderer.setClearColor(0xF0F0F0, 1); // 0xffffff is white, 1 is full opacity

const ambientLight = new THREE.AmbientLight(0xffFFFFFF,0.95 );
scene.add(ambientLight);

// Add point lights to create reflection spots
const reflection1 = new THREE.PointLight(0xffffff, 0.6, 1);
reflection1.position.set(plateWidthMeters * 0.3, plateHeightMeters * 0.34, 0.1);
scene.add(reflection1);

const reflection2 = new THREE.PointLight(0xffffff, 0.6, 1);
reflection2.position.set(plateWidthMeters * 0.1, plateHeightMeters * 0.7, 0.1);
scene.add(reflection2);

// Append renderer to the div with id '3d-scene'
document.getElementById('3d-scene').appendChild(renderer.domElement);



// Create plate geometry (a double-sided plane)
const plateGeometry = new THREE.BoxGeometry(plateWidthMeters, plateHeightMeters,0.1);
// const plateMaterial = new THREE.MeshPhongMaterial({
//   color: 0xffF0F0F0,
//   transparent: true,
//   opacity: 1, // Ad
//   side: THREE.FrontSide, 
// });

const plateMaterial = new THREE.MeshStandardMaterial({
  color: frontPlateColor,
  
  roughness: 0.3, // Slight glossiness
  metalness: 0.1, // Slight metallic effect for reflectivity
});



var plate = new THREE.Mesh(plateGeometry, plateMaterial);
var textMaterial;
scene.add(plate);

// Add text to the number plate
let plateTextMesh;
const fontLoader = new THREE.FontLoader();

const rearTab = document.querySelector('.k-pb__tab-list a[aria-selected="false"]:nth-of-type(2)');
const frontTab = document.querySelector('.k-pb__tab-list a[aria-selected="true"]:nth-of-type(1)');

rearTab.addEventListener('click', () => {
  updatePlateMaterial(true); // Set rear plate material
  updatePlateGeometry(rearPlateWidth, rearPlateHeight); // Update geometry if necessary
});

frontTab.addEventListener('click', () => {
  updatePlateMaterial(false); // Set front plate material
  updatePlateGeometry(frontPlateWidth, frontPlateHeight); // Update geometry if necessary
});



function updatePlateMaterial(isRear) {
  if (isRear) {
    plateMaterial.color.setHex(rearPlateColor); // Set to yellow
  } else {
    plateMaterial.color.setHex(frontPlateColor); // Set to white
  }

  // Adjust reflectivity/roughness for a realistic effect
  plateMaterial.roughness = 0.3; // Adjust to your desired glossiness
  plateMaterial.metalness = 0.1;
  plateMaterial.needsUpdate = true; // Ensure changes take effect
}


function updatePlateText(text) {
  if (plateTextMesh) {
    scene.remove(plateTextMesh);
  }
  fontLoader.load(
    '/fonts/Charles Wright_Bold-2.json', // Use the bold font for license plate text
    function (font) {
      textGeometry = new THREE.TextGeometry(text || 'YOUR REG', {
        font: font,
        size: 0.58, // Smaller text size for a better fit
        height: 0.03, // Adjust for thickness
        bevelEnabled: false,
        depth:5
      });

      textMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        side: THREE.FrontSide,
      });
      plateTextMesh = new THREE.Mesh(textGeometry, textMaterial);
      plateTextMesh.scale.y = 2
      // Center the text on the plate
      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
      plateTextMesh.position.set(-textWidth / 2,- 0.5, 0.05);
      scene.add(plateTextMesh);
    }
  );
}

function updatePlatNumberSize( thickness ) {

  scene.remove(plateTextMesh);

  fontLoader.load(
    '/fonts/Charles Wright_Bold-2.json', // Use the bold font
    function (font) {
         textGeometry = new THREE.TextGeometry(text || 'YOUR REG', {
            font: font,
            size: 0.58,
            height: thickness/100, // Increase height for thickness
            bevelEnabled: false, // Enable bevel
           // Size of the bevel
        });

        textMaterial = new THREE.MeshPhongMaterial({
          color: 0x000000,
          side: THREE.FrontSide,
        });
        plateTextMesh = new THREE.Mesh(textGeometry, textMaterial);
        plateTextMesh.scale.y = 2
        // Center the text on the plate
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        plateTextMesh.position.set(-textWidth / 2,- 0.5, 0.05);
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
  renderer.setSize(window.innerWidth / 4, window.innerHeight / 4);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
