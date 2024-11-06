import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js';
import { PlateItem } from './PlateItem.js'; // Adjust the path based on your file location

// DOM Elements
const plateForm = document.querySelector('.form form');
const summaryDiv = document.getElementById('summary');
const optionMenu = document.getElementById('option-menu');
const optionsContainer = document.getElementById('options-container');
const tabs = document.querySelectorAll('.k-pb__tab');
var borderr;
// Plate Item
let plateItem = new PlateItem();
let borderMesh;

// Styles, Borders, and Sizes for the plate
const styles = [
  { name: '3mm', image: 'https://aplates.co.uk/wp-content/uploads/2023/09/4D-3mm-Main-Image-Pair-Web-v2-white-640x360.jpg' },
  { name: '5mm', image: 'https://aplates.co.uk/wp-content/uploads/2023/09/4D-3mm-Main-Image-Pair-Web-v2-white-640x360.jpg' }
];

const borders = [
  { name: '4D 3mm border', image: 'https://aplates.co.uk/wp-content/uploads/2023/08/4D-3mm-Border-white-640x360.jpg' },
  { name: '4D 5mm border', image: 'https://aplates.co.uk/wp-content/uploads/2023/08/4D-5mm-Border-white-640x360.jpg' }
];

const sizes = [
  { name: 'Small', image: 'https://aplates.co.uk/wp-content/uploads/2023/07/4D-Gel-5mm-18-Rear-Web-white-640x360.jpg' },
  { name: 'Medium', image: 'https://aplates.co.uk/wp-content/uploads/2023/06/4D-3MM-Standard-20-with-black-border-Front-Main-Image-white-640x360.jpg' }
];

// Event Listeners
optionMenu.addEventListener('click', handleOptionMenuClick);
plateForm.addEventListener('change', handleFormChange);
plateForm.addEventListener('submit', handleFormSubmit);
tabs.forEach(tab => tab.addEventListener('click', handleTabSelection));

// Handle Tab Selection
function handleTabSelection(event) {
  tabs.forEach(tab => tab.setAttribute('aria-selected', 'false'));
  event.currentTarget.setAttribute('aria-selected', 'true');
}

// Handle Option Menu Clicks
function handleOptionMenuClick(event) {
  event.preventDefault();
  if (event.target.tagName === 'A') {
    const type = event.target.getAttribute('data-type');
    document.querySelectorAll('#option-menu a').forEach(item => item.classList.remove('selected'));
    event.target.classList.add('selected');
    if (type) displayOptions(type);
  }
}

// Display Options based on Type
function displayOptions(type) {
  optionsContainer.innerHTML = '';
  let options;

  switch (type) {
    case 'style': options = styles; break;
    case 'size': options = sizes; break;
    case 'border': options = borders; break;
    case 'start': displayStartOptions(); return;
    default: return;
  }

  options.forEach(option => {
    const optionDiv = createOptionElement(option);
    optionsContainer.appendChild(optionDiv);
  });
}

// Create Option Element
function createOptionElement(option) {
  const optionDiv = document.createElement('div');
  optionDiv.classList.add('option-item');
  
  const img = document.createElement('img');
  img.src = option.image;
  img.alt = option.name;
  img.style.width = '100px';

  const label = document.createElement('label');
  label.innerText = option.name;

  optionDiv.appendChild(label);
  optionDiv.appendChild(img);
  
  optionDiv.addEventListener('click', () => handleOptionSelection(option));
  return optionDiv;
}

// Handle Option Selection
function handleOptionSelection(option) {
  switch (option.name) {
    case '4D 3mm border':
    case '4D 5mm border':
      updateTextBorder(option.name);
      break;
    case 'Small':
      updatePlateGeometry(plateWidthMeters, plateHeightMeters);
      break;
    case 'Medium':
      updatePlateGeometry(plateWidthMeters + 1, plateHeightMeters);
      break;
    default:
      console.log(`Selected ${option.name}`);
  }
}

// Display Start Options
function displayStartOptions() {
  const innerHTMLContent = `
    <label for="registration">Your registration</label>
    <input type="text" id="registration" placeholder="YOUR REG" maxlength="15" autocomplete="off">
    <div id="plateError" class="hidden" style="color: white; background-color: #c70808;">Plate number too long</div>
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
    </div>`;
  
  optionsContainer.innerHTML = innerHTMLContent;
}

// Handle Form Changes
function handleFormChange(event) {
  const target = event.target;
  switch (target.id) {
    case 'registration':
      handleRegistrationInput(target.value);
      break;
    case 'character-spacing-toggle':
      plateItem.toggleCharacterSpacing();
      break;
    case 'front-plate-toggle':
      plateItem.setFrontPlate(target.checked ? 'Standard' : null);
      break;
    case 'rear-plate-toggle':
      plateItem.setRearPlate(target.checked ? 'Standard' : null);
      break;
    default:
      console.log(`Unhandled input: ${target.id}`);
  }
}

// Handle Registration Input
function handleRegistrationInput(value) {
  if (value.length <= 8) {
    plateItem.setRegistration(value);
    updatePlateText(value);
  } else {
    document.getElementById("plateError").classList.remove('hidden');
  }
}

// Handle Form Submission
function handleFormSubmit(event) {
  event.preventDefault();
  plateItem.calculatePrice();
  displaySummary();
}

// Display Summary
function displaySummary() {
  const summary = plateItem.getSummary();
  summaryDiv.innerHTML = `
    <h2>Your Plates</h2>
    <div>Registration: ${summary.registration}</div>
    <div>Road Legal: ${summary.roadLegal}</div>
    <h3>Front Plate</h3>
    <div>Style: ${summary.frontPlate.style || 'None'}</div>
    <div>Size: ${summary.frontPlate.size || 'Default'}</div>
    <div>Border: ${summary.frontPlate.border || 'None'}</div>`;
}

// Update Plate Geometry
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

// Update Text Border
function updateTextBorder(option) {
  // Define border properties
  const borderProperties = {
    "4D 3mm border": { thickness: 0.15, color: 0x000000 },
    "4D 5mm border": { thickness: 0.1, color: 0x000000 }
  };

  const { thickness, color } = borderProperties[option] || {};
  // Add logic to update text border based on thickness and color
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
