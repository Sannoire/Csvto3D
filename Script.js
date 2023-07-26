'use strict';

import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

const canvas = document.querySelector('#c');
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
const aspectN = 6; 
const near = 0.1;
const far = 2000;

let camera = new THREE.OrthographicCamera(
  -window.innerWidth/ aspectN,    
  window.innerWidth/ aspectN,    
  window.innerHeight/ aspectN,   
  -window.innerHeight / aspectN,  
  10,
  1000
);
camera.position.set(0, 200, 400);

//Контролс
let controls = new OrbitControls( camera, renderer.domElement ); 

//Сцена
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);
 
//csvToArr
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

//arrToCsv
function arrToCsv(data, delimiter) {
  // Получение заголовков столбцов из первого объекта в массиве
  const headers = Object.keys(data[0]);

  // Формирование заголовка CSV строки
  const csvHeader = headers.join(delimiter);

  // Формирование CSV строк для каждого объекта в массиве
  const csvRows = data.map((item) => {
    const values = headers.map((header) => item[header]);
    return values.join(delimiter);
  });

  // Объединение заголовка и строк в одну CSV строку
  const csvContent = [csvHeader, ...csvRows].join('\n');

  return csvContent.replace(/\s*\n\s*/g, '\n');
}

document.getElementById("myForm").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Предотвращаем отправку формы

    var inputText = document.getElementById("myInput").value;

    fetch('/figures.csv')
    .then(response => response.text())
    .then(data => { console.log(data)
      addToDisplayArray(data)
      createMenu()
    // Обработка полученных данных
    console.log(data);
  })
  .catch(error => {
    // Обработка ошибок
    console.error('Ошибка при получении файла:', error);
  });

    fetch("http://localhost:3000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: inputText })
    })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      document.getElementById("responseTextArea").value = 'Успешно';
      alert("Данные успешно отправлены на сервер!");
    })
    .catch(error => {
      console.error(error);
      alert("Произошла ошибка при отправке данных на сервер.");
    });
  }
});

let value = [];
let csvArray = 0;
let sdisplayArray = 0;
let displayArray = 0;
let JSONArray = 0;
let countFigures = 0;
let fileName;
let maxNumber = 0;
const fileInput = document.getElementById("fileInput");
const JSONInput = document.getElementById("JSONInput");
 
//Загрузка файла.
fileInput.addEventListener("change", function() {
  const file = this.files[0];
  fileName = file.name;
  readTextFile(file).then(function(data) {
    csvArray = data;
    
    addToDisplayArray(csvArray);
    createMenu(fileName);
  });
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

JSONInput.addEventListener("change", function(){
  const file = this.files[0];
  readTextFile(file).then(function(data) {
    JSONArray = JSON.parse(data);
    // console.log(JSONArray);
    countFigures = Object.keys(JSONArray).filter(key => /^Figure \d+$/.test(key)).length;
    // console.log(countFigures);
 
  })
});

//Отправка на почту*
const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", function()  {
  var div = document.createElement("div");
  div.id = "modalDiv"

  body.appendChild(div)
  var in1 = document.createElement("input")
  var in2 = document.createElement("input")
});

const consoleDiv = document.getElementById('console');
const toggleButton = document.getElementById('toggleButton');
const toggleButtonPath = document.querySelector('.toggleButtonPath');

toggleButton.addEventListener('click', function() {
  consoleDiv.classList.toggle('sticky');
});

toggleButton.addEventListener('mouseover', function() {
  toggleButtonPath.style.fill = 'white'; // Изменяем цвет fill на 'white'
});

toggleButton.addEventListener('mouseout', function() {
  toggleButtonPath.style.fill = '#000000'; // Возвращаем исходный цвет fill при уходе мыши
});

//Добавление данных в массив displayArray
let fdisp = false;
function addToDisplayArray(csv) {
  if (fdisp == false) {
    displayArray = csvToArr(csv, ";");
    //console.log(csv);
    fdisp = true;
  } else {
    // разделяем строку на массив строк, используя символ новой строки "\n" в качестве разделителя
    const lines = csv.split("\n");

    // для каждой строки в массиве, начиная со второй (индекс 1)
    for (let i = 1; i < lines.length; i++) {
      // разделяем строку на массив значений, используя символ ";" в качестве разделителя
      const values = lines[i].split(";");

      // преобразуем значение Number в число и добавляем к нему maxNumber
      const newNumber = Number(values[0]) + Number(maxNumber);

      // заменяем старое значение Number на новое
      values[0] = newNumber.toString();

      // объединяем массив значений в строку, используя символ ";" в качестве разделителя
      const newLine = values.join(";");

      // заменяем старую строку на новую
      lines[i] = newLine;
    }

    // объединяем массив строк в одну строку, используя символ новой строки "\n" в качестве разделителя
    var outputCsv = lines.join("\n");
    //console.log(outputCsv);

    sdisplayArray = csvToArr(outputCsv, ";");
    for (var i = 0; i < sdisplayArray.length; i++) {
      displayArray.push(sdisplayArray[i]);
    }
  }
  //console.log(displayArray);
}



//Отобразить всё
let vertices = [];

const displayInput = document.getElementById("displayInput");
displayInput.addEventListener("click", function (){
  if (csvArray == 0){
    displayArray = JSONArray;
  } else
  clear(0);
  var checkboxes = document.querySelectorAll('ul input[type="checkbox"]');
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = true;
  });

  for (let i = 0; i < checkArr.length; i++){
    checkArr[i] = true;
  }
  console.log(csvArray);
  console.log(arrToCsv(displayArray,';'))
  console.log(displayArray)
  display(checkArr);
});


//Отобразить
function display(Number){
  if (Array.isArray(Number) == true){
    for (let i = 0; i <= maxNumber; i++){
      if (Number[i] == true){
        for (let j = 0; j < displayArray.length; j++){
          if (displayArray[j]['Number'] == i ){
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
  scene.add(axesHelper);
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


//Изменение типа камеры с перспективного на ортографическое и обратно.
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

const axisBtnX = document.getElementById("axisBtnX")
const axisBtnY = document.getElementById("axisBtnY")
const axisBtnZ = document.getElementById("axisBtnZ")
axisBtnX.addEventListener('click', rotateCameraX);
axisBtnY.addEventListener('click', rotateCameraY);
axisBtnZ.addEventListener('click', rotateCameraZ);

// Функция поворота камеры по оси X
function rotateCameraX() {
  if (camera instanceof THREE.OrthographicCamera) {
    camera.position.set(200, 0, 0);
  } else {
    camera.position.set(400, 0, 0);
  }
}

// Функция поворота камеры по оси Y
function rotateCameraY() {
  if (camera instanceof THREE.OrthographicCamera) {
    camera.position.set(0, 200, 0);
  } else {
    camera.position.set(0, 400, 0);
  }
}

// Функция поворота камеры по оси Z
function rotateCameraZ() {
  if (camera instanceof THREE.OrthographicCamera) {
    camera.position.set(0, 0, 200);
  } else {
    camera.position.set(0, 0, 400);
  }
}


//Очистка
const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", function(){
  clear(1);
});

function clear(a){
  scene.remove.apply(scene, scene.children);
  vertices.length = 0;
  if (a == 1){
    scene.remove.apply(scene, scene.children);
    vertices.length = 0;
    for (let i = 0; i < checkArr.length; i++){
      checkArr[i] = false;
    }
    var checkboxes = document.querySelectorAll('ul input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = false;
    });
  }  


}

//Функция создания меню отображаемях фигур
const MapType = new Map([['1', "Цилиндр"], ['2', "Сфера"], ['3', "Плоскость"]]);

var checkArr = new Array(150).fill(false);
var sub = 1;

const menu = document.getElementById("menu");

function createMenu(fileName) {
  const rul = document.getElementById('ul');
  rul?.remove();
  const ul = document.createElement("ul");
  ul.id = "ul";
  maxNumber = Number(displayArray[displayArray.length-2]['Number']);
  console.log(maxNumber);
  for (var i = 1; i <= Number(maxNumber); i++) {
    var li = document.createElement("li");
    li.className = "menuli";
    li.id = "menuli-" + i;

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
        var index = Array.from(ul.children).indexOf(li);
        const checkbox = li.querySelector(".menu-checkbox");
        checkbox.checked = !checkbox.checked;
        checkArr[index + 1] = checkbox.checked;

        clear(0);
        display(checkArr);
      }
    },
    true
  );
 
  menu.appendChild(ul);
}

 

