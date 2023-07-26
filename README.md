# csvto3D
Веб-приложение позволяет загрузить файл формата CSV по кнопке и отображать объекты, которы были в этом файле. Возможность загружать файлы JSON не реализована доконца.
В разработке использовались HTML, JS, CSS, Three.js, IDE- VS Code и расширение VS Code Live Server. Приложние запускается только с Live Server.
Файл CSV должен быть определенного формата, а именно 
Number;Type;X;Y;Z
1;1;99.445672;-86.706245;-21.904302
...

Загрузка файла реализована с помощью Promise, т.к. это позволит работать с загруженными данными вне области 
fileInput.addEventListener("change", function() {
...
});.

После загрузки файла, с помощью функции createMenu(), сразу же создаётся слева сверху меню выбора отображаемых фигур.
Это меню создается динамически, тоесть при вызове функции создется определенное количество тегов.
1 тег ul, несколько тегов li (столько, сколько объектов в CSV или JSON файле). Ко всем тегам li создается функция на клик.
Потом все теги li заносятся под ul методом ul.appendChild(li).
Так же при каждом вызове функции createMenu, удаляется старый тег ul.

Так же после загрузки файла CSV выполняется функция addToDisplayArray(csvArray), которая преобразует данные файла к массиву и заносит данные в массив displayArray.

Структура данных реализована так:
	1) Есть массив checkArr, который изначально исеет размер 150 и заполнен false.
Он отвечает за положение чекбоксов внутри li, тоесть отображается данная фигура сейчас или нет. По клику на li, соответствуюзий чекбокс и 
массив cheakArr изменяется.
	2) Массив diaplsyArray хранит в себе данные об всех загружаемых файлах на момент работы веб-приложения. Данные нового файла заносятся в конец.

Отображение объектов происходит благодаря функции display(Number).
Если Number массив, (обычно вместо Number стоит массив checkArr, описанный выше) тогда: в массив vertices заносятся координаты фигур, 
соответствующих значениям true массива checkArr. Массив vertices является массивом Three.JS, в него заносятся координаты для отображения.
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

Когда происходит клик на li в меню выбора отображаемых фигур, массив checkArr изменяется, происходит очистка области отображения и отоюражаются новые фигуры
в соответствии с checkArr.
Очистка области отображения происходит в функции clear(a).
Если а = 1. Происходит очистка, которая изменяет все чекбоксы на false, изменяет все элементы массива checkArr на false, убирает объекты со сцены 
    scene.remove.apply(scene, scene.children);
    vertices.length = 0;
Очистка при а != 1 применяется в функции созданной для li, когда промто удаляются элементы со сцены и очищается массив vertices. Для последующего заполнения.

Все иконки сделаны в виде SVG, написаны в index.html
