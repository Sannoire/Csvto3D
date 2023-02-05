'use strict';

import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
document.body.appendChild(renderer.domElement); 

const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 1000;
let camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 10, 1000 );
let cameraPosX = 0;
camera.position.set(0, 200, 200);
camera.lookAt({
  x:0,
  y:0,
  z:0
});

//CONTROLS

let controls = new OrbitControls( camera, renderer.domElement ); 

//CAMERA



//SCENE

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x282c34);

//INPUT

//CSVTOARR
function csvToArr(stringVal, splitter) {
  const [keys, ...rest] = stringVal.toString()
    .trim()
    .split("\r")
    .map((item) => item.split(splitter));

  const formedArr = rest.map((item) => {
    const object = {};
    keys.forEach((key, index) => (object[key] = item.at(index)));
    return object;
  });
  return formedArr;
}


let csvArray;
const fileInput = document.getElementById("fileInput");

 
fileInput.addEventListener("change", function() {
  const file = this.files[0];
  readTextFile(file).then(function(data) {
    csvArray = data;
  });
});

function readTextFile(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
  
    reader.onload = function(event) {
      resolve(event.target.result);
    };
  
    reader.readAsText(file);
  });
}

let vertices = [];

const displayInput = document.getElementById("displayInput");
displayInput.addEventListener("click", function (){
  csvArray = csvToArr(csvArray, ";");
  console.log(csvArray);

  for (let i = 0; i < csvArray.length-1; i++){

       
    let x = csvArray[i]['X'];
    //console.log(csvArray[i]['X']);
    let y = csvArray[i]['Y']; 
    //console.log(csvArray[i]['Y']);
    let z = csvArray[i]['Z']; 
    //console.log(csvArray[i]['Z']);
    vertices.push( x, y, z);
  } 

  //GEOMETRY
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3) );
       
       
  //MATERIAL
  const material = new THREE.PointsMaterial({
    color: 'red',
    sizeAttenuation: false,
    //size: 3,      
    size: 2,    
  }); 

  const points = new THREE.Points( geometry, material );
  scene.add( points );

  //RESIZE
  window.addEventListener('resize', onWindowResize, false)
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
  }

  //ANIMATE
  function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()
  }

  //RENDERER

  function render() {
    renderer.render(scene, camera)
  }

  animate()

});

const switchCamera = document.getElementById("switchCamera");
switchCamera.addEventListener("click", function(){
  if (camera instanceof THREE.OrthographicCamera) {
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 200, 200);
    camera.lookAt({
      x:0,
      y:0,
      z:0
    });
    controls = new OrbitControls( camera, renderer.domElement ); 
  } else {
    camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, near, far );
    camera.position.set(0, 200, 200);
    camera.lookAt({
      x:0,
      y:0,
      z:0
    });
    
    controls = new OrbitControls( camera, renderer.domElement ); 
  }
    controls.update();

});


//CLEAR
const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clear);

function clear(){
  scene.remove.apply(scene, scene.children);
  vertices.length = 0;
  console.log(vertices);
}



 
 




  


