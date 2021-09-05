// Подробнее https://tech.yandex.ru/maps/jsbox/2.1/regions_mask
ymaps.ready(function () {

    

    var map = new ymaps.Map('map', {
        center: [96.97240563804684,66.51057867071874],
        zoom: 3,
        type: 'yandex#hybrid',
        controls: ['zoomControl']
    }, {
        // Ограничим область карты.
        restrictMapArea: [[-2.6006685170173194,-99.65590150704736],[84.62849845323244,-133.65590150708252]],

        balloonMaxWidth: 200,
        searchControlProvider: 'yandex#search'
    });
    map.controls.get('zoomControl').options.set({size: 'small'});

    // Загрузим регионы.
    ymaps.borders.load('001', {
        lang: 'ru',
        quality: 2
    }).then(function (result) {

        // Создадим многоугольник, который будет скрывать весь мир, кроме заданной страны.
        var background = new ymaps.Polygon([
            [
                [85, -100],
                [85, 0],
                [85, 100],
                [85, 180],
                [85, -110],
                [-85, -110],
                [-85, 180],
                [-85, 100],
                [-85, 0],
                [-85, -100],
                [85, -100]
            ]
        ], {}, {
            fillColor: '#ffffff',
            strokeWidth: 0,
            // Для того чтобы полигон отобразился на весь мир, нам нужно поменять
            // алгоритм пересчета координат геометрии в пиксельные координаты.
            //coordRendering: 'straightPath'
        });

        // Найдём страну по её iso коду.
        var region = result.features.filter(function (feature) { return feature.properties.iso3166 == 'RU'; })[0];

        // Добавим координаты этой страны в полигон, который накрывает весь мир.
        // В полигоне образуется полость, через которую будет видно заданную страну.
        var masks = region.geometry.coordinates;
        masks.forEach(function(mask){
            background.geometry.insert(1, mask);
        });
				
        // Добавим многоугольник на карту.
        map.geoObjects.add(background);
    });

    map.events.add('click', function (e) {
        if (!map.balloon.isOpen()) {
            var coords = e.get('coords');
            map.balloon.open(coords, {
                contentHeader:'Событие!',
                contentBody:
                    '<p>Координаты щелчка: ' + [
                    coords[0].toPrecision(6),
                    coords[1].toPrecision(6)
                    ].join(', ') + '</p>',
                contentFooter:'<supe>'+e.region+'</sup>'
            });
        }
        else {
            map.balloon.close();
        }
    });

  
    // var myPolygon = new ymaps.Polygon([[
    //     [64.6654, 82.7583],
    //     [ 65.2244, 100.073],
    //     [57.8378, 87.3287]
        
    // ]
    // ],
        
    //     // Описываем свойства геообъекта.
    //     {
    //         // Содержимое балуна.
    //         balloonContent: "Пожар"
    //     }, {
    //         // Описываем опции геообъекта.
    //         // Фоновое изображение.
    //       //  fillImageHref: 'images/lake.png',
    //         // Тип заливки фоном.
    //         fillMethod: 'stretch',
    //         fillColor: '#ff0000',
    //         // Убираем видимость обводки.
    //         stroke: false
    //     })

    //     map.geoObjects.add(myPolygon);
        
    var tab = document.getElementById("tableObjects");
    var countAir = document.getElementById("countAir");
    var squeaAir = document.getElementById("squeaAir");
    var incFair = document.getElementById("incFair");
  

        document.getElementById('but').onclick = function(){
           var dateReq = document.getElementById('date').value
            fetch('http://127.0.0.1:5000/getFires/'+ dateReq).then(function(response){
				if(response.status!==200){   
 			 console.log(response.status);
 	 		return;
			}
            response.json().then(function(data) {


                var newRow=tab.insertRow(0);
                var HeaderCell0 = newRow.insertCell(0);
    		    var HeaderCell1 = newRow.insertCell(1);
                var HeaderCell2 = newRow.insertCell(2);
                var HeaderCell3 = newRow.insertCell(3);
                var HeaderCell4 = newRow.insertCell(4);
                var HeaderCell5 = newRow.insertCell(5);
                HeaderCell0.innerText = "№";
                HeaderCell1.innerText = "ID пожара";
                HeaderCell2.innerText = "Дата начала пожара";
                HeaderCell3.innerText = "Длителность пожара";
                HeaderCell4.innerText = "Площадь покрытия";
                HeaderCell5.innerText = "Прирост новых площадей";
                 var j =0;
                 console.log(data)
                 var inc =0;
                 var areaAll =0;
                 
                for(item of data){
                    PrintPol(item['polygon'],'#ff0000') ;
                    var newRow=tab.insertRow(j+1);
                        var newCell0 = newRow.insertCell(0);
    		            var newCell1 = newRow.insertCell(1);
                        var newCell2 = newRow.insertCell(2);
                        var newCell3 = newRow.insertCell(3);
                        var newCell4 = newRow.insertCell(4);
                        var newCell5 = newRow.insertCell(5);
                        newCell0.innerText = j+1
                        newCell1.innerText = item['id']
                        newCell2.innerText =  item['ignition_day']
                        newCell3.innerText =  item['num_days']
                        newCell4.innerText =  item['fire_area']
                        newCell5.innerText =  item['increase']
                        newRow.onclick = bal.bind(null,item['polygon'][0]);
                        j++;
                    // console.log(item['cord'])
                   
                    if(typeof item['increase']=== 'string' || item['increase'] instanceof String ){
                    var res = item['increase'].replace(/[^\.\d]/g,'');
                   
                    inc+= Number(item['increase'].replace(/[^\.\d]/g,''))
                    
                    }
                    console.log(inc)
                    areaAll+= Number(item['fire_area'].replace(/[^\.\d]/g,''))
                    
                     

                    // for(var i=0;i< item['polygon'].length;i++){
                    //     var newRow=tab.insertRow(i+1);
                    //     var newCell0 = newRow.insertCell(0);
    		        //     var newCell1 = newRow.insertCell(1);
                    //     var newCell2 = newRow.insertCell(2);
                    //     newCell0.innerText = i+1
                    //     newCell1.innerText = item['polygon'][i]
                    //     newCell2.innerText =  "Reg"
                    //     //console.log(item['cord'][i]) ;
                    //      newRow.onclick = bal.bind(null,item['polygon'][i][0]);
                    // }
                }
                console.log(areaAll)
                console.log(inc)
               countAir.innerHTML = String(j);
                squeaAir.innerHTML = String(areaAll);
                incFair.innerHTML= String(inc);

            });
        });

        }
        function padStr(i) {
            return (i < 10) ? "0" + i : "" + i;
        }

        document.getElementById('prog').onclick = function(){

            var dayInc = document.getElementById('dayVal').value
            var dateReq = document.getElementById('date').value
            var date1 = new Date(dateReq)
            console.log(date1.getDate());
            var date2 = Number(dayInc)
            date1.setDate(date1.getDate() + date2);
          
            var stDate  = date1.getFullYear() +"-"+padStr(date1.getMonth()+1)+"-"+padStr(date1.getDate())
            console.log(date1);
            console.log(stDate);
            fetch('http://127.0.0.1:5000/getFiresProg/'+ stDate).then(function(response){
				if(response.status!==200){   
 			 console.log(response.status);
 	 		return;
			}
            response.json().then(function(data) {
                console.log(data)
                for(item of data){
                    PrintPol(item['polygon'],'#9d9101') ;
                }

            })



        })
            

        }
















        document.getElementById('clear').onclick = function(){
            map.geoObjects.each(function (item) {
                if(item.geometry.getType() == "Polygon" && item.options._options.fillColor!='#ffffff'){
            
                           map.geoObjects.remove(item)
                }
                           })
                           while (tab.firstChild) {
                            tab.removeChild(tab.firstChild);
                        }
        }

        function PrintPol(items, color){
            var myPolygon = new ymaps.Polygon([items],
                
                // Описываем свойства геообъекта.
                {
                    // Содержимое балуна.
                    balloonContent: "<h5>Пожар!</h5> <p> Координаты: " +items[0][0] +"</p>"
                }, {
                    // Описываем опции геообъекта.
                    // Фоновое изображение.
                  //  fillImageHref: 'images/lake.png',
                    // Тип заливки фоном.
                    fillMethod: 'stretch',
                    fillColor: color,
                    // Убираем видимость обводки.
                    stroke: false
                })
    
                map.geoObjects.add(myPolygon);
        }
        var addres = ""
        
        function bal(coords){
            getAddress(coords);
            map.balloon.open(coords, {
                contentHeader:'Пожар!',
                contentBody:
                    '<p>Координаты пожара: ' + [
                    coords[0].toPrecision(6),
                    coords[1].toPrecision(6)
                    ].join(', ') + '</p>',
                contentFooter:'<supe>'+  getAddress(coords) + '</sup>'
            });
        }

        function getAddress(coords) {
            ymaps.geocode(coords).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);
               var address = firstGeoObject.getAddressLine();
                addres = address 
                console.log(address);
                
            })
            console.log( addres);
            return addres
        }



});