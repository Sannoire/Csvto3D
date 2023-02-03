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
const aspect = 2;//canvas.clientWidth / canvas.clientHeight;
const near = 0.1;
const far = 1000;
//const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 10, 1000 );
camera.position.set(0, 200, 200);
camera.lookAt({
  x:0,
  y:0,
  z:0
});

//CONTROLS

const controls = new OrbitControls( camera, renderer.domElement ); 

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

let csvArray = [];
const vertices = [];


document.querySelector("#displayInput").addEventListener('click', function () {
  let file = document.getElementById('csvFile').files[0];
  let reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function (e) {
    csvArray = csvToArr(e.target.result, ";");
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

    // var switchCamera = function() {
    // if (camera instanceof THREE.OrthographicCamera) {
    //   camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //   camera.position.set(0, 0, 100);
    // } else {
    //   camera = new THREE.OrthographicCamera(- window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, - window.innerHeight / 2, 0.1, 1000);
    //   camera.position.set(0, 0, 100);
    // }
    //   controls.update();
    // }



      
    animate()
     
  }

  
}) 


 
 




  


