// 'use strict';

import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';



const canvas = document.querySelector('#c')!;
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
document.body.appendChild(renderer.domElement); 

const fov = 45;
const aspect = 2;
const aspectN = 6; //OrthographicCamera
const near = 1;
const far = 1000;

let camera = new THREE.OrthographicCamera(
  -canvas.clientWidth / aspectN,
  canvas.clientWidth / aspectN,
  canvas.clientHeight / aspectN,
  -canvas.clientHeight / aspectN,
  near,
  far
);
 
camera.lookAt({
  x:100,
  y:100,
  z:100
});
//console.log(window.innerWidth / window.innerHeight); // соотношение сторон канваса
//console.log(aspect); // соотношение сторон камеры

//Контролс
let controls = new OrbitControls( camera, renderer.domElement ); 

//Сцена
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);
 

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
let displayArray = 0;
let JSONArray = 0;
let countFigures = 0;
let fileName;
let maxNumber = 0;
const fileInput = document.getElementById("fileInput");
const JSONInput = document.getElementById("JSONInput");
 
fileInput?.addEventListener("change", function(event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  let fileName = file?.name;
  if (file) {
    readTextFile(file).then((data: unknown) => {
      const csvArray = String(data);
      const displayArray = csvToArr(csvArray, ";");
      addNewUl(fileName);
    });
  }
});

// JSONInput?.addEventListener("change", function(){
//   const file = this.files?.[0];
//   readTextFile(file).then(function(data) {
//     JSONArray = JSON.parse(data);
//     // console.log(JSONArray);
//     countFigures = Object.keys(JSONArray).filter(key => /^Figure \d+$/.test(key)).length;
//     // console.log(countFigures);
 
//   })
// });

function readTextFile(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
  
    reader.onloadend = function(event) {
      resolve(event.target?.result);
    };
    reader.readAsText(file);
  });
}

//Отобразить всё
let vertices = [];

const displayInput = document.getElementById("displayInput");
displayInput?.addEventListener("click", function (){
  if (csvArray == 0){
    displayArray = JSONArray;
  } else
  clear();
  // addAllToVertices();
  display(0);

});


//Отобразить
function display(Number){
  // CSV
  if (Array.isArray(Number) == true){
    for (let i = 0; i <= maxNumber; i++){
      if (Number[i] == true){
        for (let j = 0; j < displayArray.length-1; j++){
          if (displayArray[j]['Number'] == i){
            let x = displayArray[j]['X'];
            let y = displayArray[j]['Y']; 
            let z = displayArray[j]['Z']; 
            vertices.push( x, y, z);  
          }
  
        }
      }
    }

  } else
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
  // for (let j = 1; j <= countFigures; j++) {
  //   let figure = "Figure " + j;
  //   console.log(figure);
  //   for (let i = 0; i <= displayArray[figure]['X'].length - 1; i++) {
  //     let x = displayArray[figure]['X'][i];
  //     console.log(displayArray[figure]['X'][i]);
  //     let y = displayArray[figure]['Y'][i];
  //     console.log(displayArray[figure]['Y'][i]);
  //     let z = displayArray[figure]['Z'][i];
  //     console.log(displayArray[figure]['Z'][i]);
  //     vertices.push(x, y, z);
  //   }
  // }

  // console.log(vertices);

  //Геометрия
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3) );
        
  //Материал
  const material = new THREE.PointsMaterial({
    color: 'red',
    sizeAttenuation: false,
    size: 3,      
    //size: 2,    
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

  //Рендерер
  function render() {
    renderer.render(scene, camera)
  }
  animate()
}

// function display(displayArray, number) {
//   const vertices = [];

//   for (let i = 0; i < displayArray.length; i++) {
//     const item = displayArray[i];
//     const isCsv = item.hasOwnProperty("X") && item.hasOwnProperty("Y") && item.hasOwnProperty("Z");

//     if (isCsv && number === 0) {
//       const { X: x, Y: y, Z: z } = item;
//       vertices.push(x, y, z);
//     } else if (!isCsv && item.Number === number) {
//       const { X: x, Y: y, Z: z } = item;
//       vertices.push(x, y, z);
//     }
//   }

//   const settings = {
//     color: "red",
//     sizeAttenuation: false,
//     size: 2,
//   };

//   const geometry = createGeometry(vertices);
//   const material = createMaterial(settings);
//   const points = createPoints(geometry, material);

//   addToScene(points);

//   const loader = new THREE.TextureLoader();
//   const bgTexture = loader.load("images/background.jpg");
//   setBackground(bgTexture);

//   window.addEventListener("resize", onWindowResize);
//   animate();

//   function createGeometry(vertices) {
//     const geometry = new THREE.BufferGeometry();
//     geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
//     return geometry;
//   }

//   function createMaterial(settings) {
//     return new THREE.PointsMaterial(settings);
//   }

//   function createPoints(geometry, material) {
//     return new THREE.Points(geometry, material);
//   }

//   function addToScene(object) {
//     scene.add(object);
//   }

//   function setBackground(texture) {
//     scene.background = texture;
//   }

//   function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     render();
//   }

//   function animate() {
//     requestAnimationFrame(() => {
//       animate();
//     });
//     controls.update();
//     render();
//   }

//   function render() {
//     renderer.render(scene, camera);
//   }
// }

//SwitchCamera
const switchCamera = document.getElementById("switchCamera");
let cameraPosition, cameraTarget;

switchCamera.addEventListener("click", function(){
  if (camera instanceof THREE.OrthographicCamera) {
    cameraPosition = camera.position.clone();
    cameraTarget = controls.target.clone();
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.copy(cameraPosition);
    camera.lookAt(cameraTarget);
    controls = new OrbitControls(camera, renderer.domElement); 
  } else {
    cameraPosition = camera.position.clone();
    cameraTarget = controls.target.clone();
    camera = new THREE.OrthographicCamera(
      -window.innerWidth/ aspectN,    
      window.innerWidth/ aspectN,    
      window.innerHeight/ aspectN,   
      -window.innerHeight / aspectN,  
      10,
      1000
    );
    camera.position.copy(cameraPosition);
    camera.lookAt(cameraTarget);
    controls = new OrbitControls(camera, renderer.domElement); 
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
}

const MapType = new Map([['1', "Цилиндр"], ['2', "Сфера"], ['3', "Плоскость"]]);




function tree_toggle(event) {
  event = event || window.event
  var clickedElem = event.target || event.srcElement

  if (!hasClass(clickedElem, 'Expand')) {
          return // клик не там
  }

  // Node, на который кликнули
  var node = clickedElem.parentNode
  if (hasClass(node, 'ExpandLeaf')) {
          return // клик на листе
  }

  // определить новый класс для узла
  var newClass = hasClass(node, 'ExpandOpen') ? 'ExpandClosed' : 'ExpandOpen'
  // заменить текущий класс на newClass
  // регексп находит отдельно стоящий open|close и меняет на newClass
  var re =  /(^|\s)(ExpandOpen|ExpandClosed)(\s|$)/
  node.className = node.className.replace(re, '$1'+newClass+'$3')
}


function hasClass(elem, className) {
  return new RegExp("(^|\\s)"+className+"(\\s|$)").test(elem.className)
}

const allUls = []; // массив для хранения всех созданных ul
const value = [];
var checkArr = new Array(50).fill(false);
var j = 1;

function createMenu(fileName) {
  const ul = document.createElement("ul");
  value.push(displayArray);
  ul.textContent = fileName;
  ul.id = "menul" + j;
  console.log(ul.id);
  

  maxNumber = displayArray.reduce((max, item) => {
    return item.Number > max ? item.Number : max;
  }, 0);

  for (var i = 1; i <= maxNumber; i++) {
    var li = document.createElement("li");
    li.className = "menuli";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "menu-checkbox";
    checkbox.id = "checkbox-" + i;
    li.appendChild(checkbox);

    var label = document.createElement("label");
    label.htmlFor = "checkbox-" + i;
    label.textContent = "Item " + i;
    li.appendChild(label);

    for (var j = 1; j < displayArray.length; j++) {
      if (displayArray[j]["Number"] == i) {
        var k = MapType.get(displayArray[j]["Type"]);
        label.textContent =
          displayArray[j]["Number"] + " " + MapType.get(displayArray[j]["Type"]);
        //console.log(k);
        j = 1;
        break;
      }
    }
    ul.appendChild(li);
  }

  ul.addEventListener(
    "click",
    (event) => {
      const li = event.target.closest("li");
      if (li && ul.contains(li)) {
        const index = Array.from(ul.children).indexOf(li);
        const checkbox = li.querySelector(".menu-checkbox");
        checkbox.checked = !checkbox.checked;
        checkArr[index + 1] = checkbox.checked;
        //console.log(checkArr[index]);
        clear();
        display(checkArr);
      }
    },
    true
  );

  return ul;
}

function addNewUl(fileName) {
  j += 1;
  const ul = createMenu(fileName); // вызов createMenu для создания нового ul
  allUls.push(ul); // добавление нового ul в массив всех ul
  menu.appendChild(ul); // добавление нового ul в меню
  console.log(allUls);
  //console.log(value);
}

