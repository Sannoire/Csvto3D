'use strict';

import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';


const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
document.body.appendChild(renderer.domElement); 

const fov = 45;
const aspect = 2;//canvas.clientWidth / canvas.clientHeight;
const near = 0.1;
const far = 10000;
const perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const orthographicCamera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, near, far);
perspectiveCamera.position.set(0, 200, 300);
orthographicCamera.position.set(0, 200, 300);
const camera = perspectiveCamera;

//CONTROLS

let a = 0;

const controls = new OrbitControls(  camera, renderer.domElement ); 

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x282c34);

//LIGHT

/* {
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
} */

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

const form = document.querySelector("#csvForm");
const csvFileInput = document.querySelector("#csvInput");

let csvArray = [];
const vertices = [];

inputCSV.addEventListener("", function(e){
  e.preventDefault();
  const file = csvFileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(e){
    csvArray = csvToArr(e.target.result, ";");
    console.log(csvArray);
  }
  reader.readAsText(file);
})

for (let i = 0; i < csvArray.length; i++){

  let x = csvArray[i]['X'];
  console.log(csvArray[i]['X']);
  let y = csvArray[i]['Y'];
  console.log(csvArray[i]['Y']);
  let z = csvArray[i]['Z'];
  console.log(csvArray[i]['Z']);
  vertices.push( x, y, z );
} 

//GEOMETRY
const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3) );

//MATERIAL
const material = new THREE.PointsMaterial({
  color: 'red',
  sizeAttenuation: false,
  size: 3,      
  //size: 0.2,    
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

/* form.addEventListener("submit", function (e) {
  e.preventDefault();
  const file = csvFileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    csvArray = csvToArr(e.target.result, ";");
    console.log(csvArray);
    
    for (let i = 0; i < csvArray.length; i++){

      let x = csvArray[i]['X'];
      //console.log(csvArray[i]['X']);
      let y = csvArray[i]['Y'];
      //console.log(csvArray[i]['Y']);
      let z = csvArray[i]['Z'];
      //console.log(csvArray[i]['Z']);
      vertices.push( x, y, z );
    } 

    //GEOMETRY

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3) );

    //MATERIAL

    const material = new THREE.PointsMaterial({
      color: 'red',
      sizeAttenuation: false,
      size: 3,      
      //size: 0.2,    
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
     
  }

  reader.readAsText(file);
})  */

function switchCamera(){
  camera = perspectiveCamera;

}


 
 




  


