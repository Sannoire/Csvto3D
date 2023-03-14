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

//Контролс
let controls = new OrbitControls( camera, renderer.domElement ); 

//Сцена
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x282c34);

//Ввод
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

let csvArray = 0;
let JSONArray = 0;
let countFigures = 0;
const fileInput = document.getElementById("fileInput");
const JSONInput = document.getElementById("JSONInput");
 
fileInput.addEventListener("change", function() {
  const file = this.files[0];
  readTextFile(file).then(function(data) {
    csvArray = data;
    createMenu(csvToArr(event.target.result, ";"));
  });
});

JSONInput.addEventListener("change", function(){
  const file = this.files[0];
  readTextFile(file).then(function(data) {
    JSONArray = JSON.parse(data);
    console.log(JSONArray);
    countFigures = Object.keys(JSONArray).filter(key => /^Figure \d+$/.test(key)).length;

    console.log(countFigures);
 
  })
});

function readTextFile(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
  
    reader.onloadend = function(event) {
      resolve(event.target.result);
    };
    reader.readAsText(file);
  });
}

//Отобразить всё
let vertices = [];

const displayInput = document.getElementById("displayInput");
displayInput.addEventListener("click", function (){
  let displayArray;
  if (csvArray == 0){
    displayArray = JSONArray;
  } else
  displayArray = csvToArr(csvArray,";");
  display(displayArray, 0);

});



//Отобразить
function display(displayArray, Number){
  //CSV
  for (let i = 0; i < displayArray.length-1; i++){
    if (Number == 0){
      let x = displayArray[i]['X'];
      let y = displayArray[i]['Y']; 
      let z = displayArray[i]['Z']; 
      vertices.push( x, y, z);
    } else
    if (displayArray[i]['Number'] == Number){
      let x = displayArray[i]['X'];
      let y = displayArray[i]['Y']; 
      let z = displayArray[i]['Z']; 
      vertices.push( x, y, z);
    } 
  } 
  //JSON
  for (let j = 1; j <= countFigures; j++) {
    let figure = "Figure " + j;
    console.log(figure);
    for (let i = 0; i <= displayArray[figure]['X'].length - 1; i++) {
      let x = displayArray[figure]['X'][i];
      console.log(displayArray[figure]['X'][i]);
      let y = displayArray[figure]['Y'][i];
      console.log(displayArray[figure]['Y'][i]);
      let z = displayArray[figure]['Z'][i];
      console.log(displayArray[figure]['Z'][i]);
      vertices.push(x, y, z);
    }
  }

  // for (let j = 1; j <= countFigures; j++){
  //   let figure = "Figure " + j;
  //   console.log(figure);
  //   for (let i = 0; i <= displayArray[figure][['X']].length-1; i++){
  //     let x = displayArray['Figure 1'].X[i];
  //     console.log(displayArray['Figure 1'].X[i]);
  //     let y = displayArray['Figure 1'].Y[i];
  //     console.log(displayArray['Figure 1'].Y[i]);
  //     let z = displayArray['Figure 1'].Z[i];
  //     console.log(displayArray['Figure 1'].Z[i]);
  //     vertices.push( x, y, z);
  //   }
  // }

    // if (Number == 0){
    //   let x = displayArray['Figure 1'][['X'][i]];
    //   let y = displayArray['Figure 1'][['Y'][i]];
    //   let z = displayArray['Figure 1'][['Z'][i]];
    //   vertices.push( x, y, z);
    // } else
    // if (displayArray[i]['Number'] == Number){
    //   let x = displayArray[i]['X'];
    //   let y = displayArray[i]['Y']; 
    //   let z = displayArray[i]['Z']; 
    //   vertices.push( x, y, z);
    // } 
  

  // for (let i = 0; i <= displayArray.X.length-1; i++){
  //   if (Number == 0){
  //     let x = displayArray.X[i];
  //     let y = displayArray.Y[i];
  //     let z = displayArray.Z[i]; 
  //     vertices.push( x, y, z);
  //   } else
  //   if (displayArray[i]['Number'] == Number){
  //     let x = displayArray[i]['X'];
  //     let y = displayArray[i]['Y']; 
  //     let z = displayArray[i]['Z']; 
  //     vertices.push( x, y, z);
  //   } 
  // } 


  //Геометрия
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3) );
        
  //Материал
  const material = new THREE.PointsMaterial({
    color: 'red',
    sizeAttenuation: false,
    //size: 3,      
    size: 2,    
  }); 

  const points = new THREE.Points( geometry, material );
  scene.add( points );

  //Размер окна
  window.addEventListener('resize', onWindowResize, false)
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
  }

  //Анимация
  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()
  }

  //Рендер
  function render() {
    renderer.render(scene, camera)
  }
  animate()
}

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

// const split = document.getElementById("split");
// split.addEventListener("click", function(){
// });

//Очистка
const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clear);
function clear(){
  scene.remove.apply(scene, scene.children);
  vertices.length = 0;
  console.log(vertices);
}

const MapType = new Map([['1', "Цилиндр"], ['2', "Сфера"], ['3', "Поверхность"]]);

//Создание меню
function createMenu(displayArray) {
  var menu = document.createElement("div");
  menu.id = "menu";
  menu.className = "menu";
  var ul = document.createElement("ul");

  // Находим максимальное значение Number
  var maxNumber = 0;
  for (var i = 0; i < displayArray.length; i++) {
    if (displayArray[i]['Number'] > maxNumber) {
      maxNumber = displayArray[i]['Number'];
    }
  }

  // Создаем пункты меню и добавляем их в список
  for (var i = 1; i <= maxNumber ; i++) {
    var li = document.createElement("li");
    for (var j = 1; j < displayArray.length; j++){
      if (displayArray[j]['Number'] == i) {
        var k = MapType.get(displayArray[j]['Type']);
        li.textContent = MapType.get(displayArray[j]['Type']) + displayArray[j]['ID']; 
        console.log(k);
        j = 1; 
        break;
      }
    }
  
    ul.appendChild(li);
  }

  menu.appendChild(ul);
  document.body.appendChild(menu);

  // получаем список всех пунктов меню
  const menuItems = document.querySelectorAll('.menu li');

  // добавляем обработчик клика на каждый пункт меню
  menuItems.forEach((item, index) => {
    item.addEventListener('click', function() { 
      display(displayArray,index+1)
    });
  });
}





 
 




  


