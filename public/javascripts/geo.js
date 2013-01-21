function Unact(){
	var me=this;
	
	me.common = {
		on_select: function(sid, prov){
			if(sid != current_id){
				var pred_id=0,
					longitude = parseFloat($('a_' + sid + '_longitude').value),
					latitude = parseFloat($('a_' + sid + '_latitude').value);
				
				if ( !isNaN(longitude) && !isNaN(latitude) ) {
					map.setCenter([latitude, longitude], 13, {checkZoomRange: true});
					for (var i = 0; i < pp.length; i++) {
						if (pp[i].id == sid) {
								placemarks[i].options.set("preset", "twirl#workshopIcon");
								placemarks[i].options.set("draggable", true);
								placemarks[i].balloon.open([latitude, longitude]);
						}
						else {
							placemarks[i].options.set("preset", "twirl#shopIcon");
							placemarks[i].options.set("draggable", false);
						};
					};	
				};
				if(prov){
					$('topform').select('tr.rdata').each(function(d){
						d.style.backgroundColor = 'white'; 
					});
					//очищаем привязку элементов в верхней таблице
					$('topform').select('input.join').each(function(i){
						i.value="-1";
					});
				} else {
					$$('tr.rdata').each(function(d){
						d.style.backgroundColor = 'white'; // был transparent
					});					
				}
				
				$('row_' + sid ).style.backgroundColor = '#FFFBB2';
				pred_id = current_id; 
				current_id = sid;
				for (var i = 0; i < pp.length; i++) {
					if (pp[i].id == current_id) {
						placemarks[i].options.set("preset", "twirl#workshopIcon");
						placemarks[i].options.set("draggable", true);
					}
					else {
						if (pp[i].id == pred_id) { 
							placemarks[i].options.set("preset", "twirl#shopIcon");
							placemarks[i].options.set("draggable", false);
						};
					};
				}
				
				if(prov){
					me.geo.geocode_addr($('a_'+sid+'_fulladdress').value, true, false, current_id);
				}
			}
		},
		
		find_addr: function(sid, page){
			var srcaddress = $('a_' + sid + '_srcaddress').value;
			var geocoder = new ymaps.geocode(srcaddress);
			
			me.common.on_select( sid );
			
			// Создание обработчика для успешного завершения геокодирования
            geocoder.then(
            	function (res) {
					var n = res.geoObjects.getLength();
					var geoResultInfo, geoResultPoint;
					if (n>0) {
							geoResultInfo = res.geoObjects.get(0).properties.get("metaDataProperty").GeocoderMetaData;
							geoResultPoint = res.geoObjects.get(0).geometry.getCoordinates();
					} else {
						alert("Ничего не найдено!");
						return;
					};
					if (geoResultInfo.kind == "country" || geoResultInfo.kind == "province" || geoResultInfo.kind == "district") {
						alert("Слишком общий адрес!");
						return;
					};
					if (geoResultInfo.kind == 'locality') {
						for (var i = 0; i < main_city.length; i++) { 
							try {
								if (geoResultInfo.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName == main_city[i].city) {
									alert("Не могу найти улицу в городе!");
									return;
								};
							}
							catch(e) {
									;
							};
						};
					};

					map.setCenter(geoResultPoint, 13, {checkZoomRange: true});
					for (var i = 0; i < pp.length; i++) {
						if (pp[i].id == sid) {
								placemarks[i].options.set("preset", "twirl#workshopIcon");
								placemarks[i].options.set("draggable", true);
								placemarks[i].geometry.setCoordinates(geoResultPoint);
								
								switch(page){
									case "geo":
										me.common.functionGeo(i, geoResultPoint);
									break;
									case "placeunload":
										me.common.functionPlaceunload(sid, i);
									break;
								}
								
								$('a_' + sid + '_fulladdress').value = geoResultInfo.text;
								$('a_' + sid + '_needsave').checked = true;
						}
						else {
							placemarks[i].options.set("preset", "twirl#shopIcon");
							placemarks[i].options.set("draggable", false);
						};
					};
					$('a_' + current_id + '_longitude').value = geoResultPoint[1];
					$('a_' + current_id + '_latitude').value  = geoResultPoint[0];
	            },
	            function (error) {
	            	alert("Произошла ошибка: " + error);
				}
			);
		},
		
		functionPlaceunload: function(sid, i){
			for (var j = 0; j < rr.length; j++) {
				if ( polygons[j].geometry.contains(placemarks[i].geometry.getCoordinates() ) ) {
					$('a_' + sid + '_buyers_route_id').value = rr[j].id;
				};
			};
		},
		
		functionGeo: function(i, geoResultPoint){
			placemarks[i].balloon.open(geoResultPoint);
		},
		
		on_needsave: function( sid ){
			$('a_' + sid + '_needsave').checked = true;
		}
	};
	
	me.geo = {
		init: function(center){
			map = new ymaps.Map("YMapsID",
				{
					center: center,
					zoom: 13,
			        behaviors: ["default", "scrollZoom"]
				}
			);
			
			// Добавление элементов управления
			map.controls.add("zoomControl");
			map.controls.add("typeSelector");
			
			for (var i = 0; i < pp.length; i++) {
				placemarks[i] = new ymaps.Placemark(
					(pp[i].latitude!=null && pp[i].longitude!=null &&
					pp[i].latitude!="" && pp[i].longitude!="")?
						[pp[i].latitude, pp[i].longitude]:
						center, 
					{
						draggable: false,
						balloonMaxWidth: 100,
						balloonAutoPan: true,
						balloonContent: pp[i].pname 
					},
					{
						preset: "twirl#shopIcon",
					}
				);
				map.geoObjects.add(placemarks[i]);
				placemarks[i].events.add("dragend", function (mEvent) {
					var coords=mEvent.originalEvent.target.geometry.getCoordinates();
					me.geo.setCoords(coords);
				});
			};
			map.events.add("click", function (mEvent) {
				if($('a_' + current_id + '_latitude') != null){
					var coords=mEvent.get('coordPosition');
					for (var i = 0; i < pp.length; i++) {
						if (pp[i].id == current_id) {
							placemarks[i].geometry.setCoordinates(coords);
						};
					};
					me.geo.setCoords(coords);
				}
			});
		},
		
		setCoords: function(coords){
        	$('a_' + current_id + '_latitude').value  = coords[0];
			$('a_' + current_id + '_longitude').value = coords[1];
			$('a_' + current_id + '_ismanual').checked = true;
			me.common.on_needsave(current_id);
		}
	};
	
	me.placeunload={
		geocode_addr: function(srcaddress, iscoord, isFake, currentId) {
			var geocoder = new ymaps.geocode(srcaddress);
			$('spinner1').show();
			$('mainform').update('Подождите пожалуйста, идет поиск.....');			
	        // Создание обработчика для успешного завершения геокодирования
			geocoder.then(
				function (res) {
					var n = res.geoObjects.getLength();
					var geoResultInfo, geoResultPoint;
					if (n>0) {
							geoResultInfo = res.geoObjects.get(0).properties.get("metaDataProperty").GeocoderMetaData;
							geoResultPoint = res.geoObjects.get(0).geometry.getCoordinates();
					} else {
						alert("Ничего не найдено!");
						return;
					};
					if (geoResultInfo.kind == "country" || geoResultInfo.kind == "province" || geoResultInfo.kind == "district") {
						alert("Слишком общий адрес!");
						return;
					};
					if (geoResultInfo.kind == 'locality') {
						for (var i = 0; i < main_city.length; i++) { 
							try {
								if (geoResultInfo.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName == main_city[i].city) {
									alert("Не могу найти улицу в городе!");
									return;
								};
							}
							catch(e) {
									;
							};
						};
					};
					
					if (iscoord || isFake) {
						map.setCenter(geoResultPoint, 16);
						
						if(currentId!=null){
							for (var i = 0; i < pp.length; i++) {
								if (pp[i].id == current_id) {
									placemarks[i].options.set("preset", "twirl#workshopIcon");
									placemarks[i].options.set("draggable", true);
									placemarks[i].geometry.setCoordinates(geoResultPoint);
									$('a_' + current_id + '_fulladdress').value = geoResultInfo;
									$('a_' + current_id + '_needsave').checked = true;
								}
								else {
									placemarks[i].options.set("preset", "twirl#shopIcon");
									placemarks[i].options.set("draggable", false);
								};
							}
							
							$('a_' + currentId + '_longitude').value = geoResultPoint[1];
							$('a_' + currentId + '_latitude').value = geoResultPoint[0];
						} else {
							placemark.geometry.setCoordinates(geoResultPoint);
							$('a_longitude').value = geoResultPoint[1];
							$('a_latitude').value  = geoResultPoint[0];
						}
					};
					
					if(currentId==null){
						for (var i = 0; i < rr.length; i++) {
							if ( polygons[i].geometry.contains(geoResultPoint) ) {
								$('placeunload_buyers_route_id').value = rr[i].id;
							};
			            }
					}
					
		            if(!isFake){
		            	if(currentId!=null){
		            		$('a_'+currentId+'_fulladdress').value = geoResultInfo.text;
		            	} else {
		            		$('a_fulladdress').value = geoResultInfo.text;
		            	}
		            	findPlace();
		            } else {
		            	$('a_fulladdress').value = $('a_loadto').value;
		            	findPlaceFake();
		            }
		        },
		        function (error) {
		        	alert("Произошла ошибка: " + error);
		        	$('spinner1').hide(); 
					$('mainform').update('Ошибка!');
				}
			);
	        
	        if(isFake){
		        $('a_fulladdress').value = $('a_loadto').value;
				$('placeunload_ischeck').value = 0;
			}
		},
		
		init: function(center, page){
			map = new ymaps.Map("YMapsID",
				{
					// Центр карты
					center: center,
					zoom: 13,
					// Тип карты
					type: "yandex#map",
					behaviors: ["default", "scrollZoom"]
				}
			);
			
			// Добавление элементов управления
            map.controls.add("zoomControl");
            map.controls.add("typeSelector");
            
			for (var i = 0; i < pp.length; i++) {
				placemarks[i] = new ymaps.Placemark(
					(pp[i].latitude!=null && pp[i].longitude!=null &&
					pp[i].latitude!="" && pp[i].longitude!="")?
						[pp[i].latitude, pp[i].longitude]:
						center, 
					{
						draggable: false,
						balloonMaxWidth: 100,
						balloonAutoPan: true,
						balloonContent: pp[i].pname 
					},
					{
						preset: "twirl#shopIcon",
					}
				);
				placemarks[i].row_id = pp[i].id;
				
				map.geoObjects.add(placemarks[i]);
				
				placemarks[i].events.add("dragend", function (mEvent) {
					var coords=mEvent.originalEvent.target.geometry.getCoordinates();
					me.placeunload.setCoords(coords, page);
				});
				
				placemarks[i].events.add("balloonopen", function (obj) {
					var rowId=obj.originalEvent.balloon.getData().geoObject.row_id;
					switch(page){
						case "index":
							$$('tr.rdata').each(function(d){
								d.style.backgroundColor = 'white';
							});
						break;
						case "prov":
							$('topform').select('tr.rdata').each(function(d){
								d.style.backgroundColor = 'white';
							});
						break;
					}
					
					$('row_' + rowId ).style.backgroundColor = '#FFFBB2';
					$('row_' + rowId ).scrollIntoView();
					pred_id = current_id; 
					current_id = rowId;
					for (var i = 0; i < pp.length; i++) {
						if (pp[i].id == current_id) {
							placemarks[i].options.set("preset", "twirl#workshopIcon");
							placemarks[i].options.set("draggable", true);
						}
						else {
							if (pp[i].id == pred_id) { 
								placemarks[i].options.set("preset", "twirl#shopIcon");
								placemarks[i].options.set("draggable", false);
							};
						};
					};
				});
            };
            map.events.add("click", function(mEvent){
            	me.placeunload.onMapClick(mEvent, page);
            });
			
			for (var i = 0; i < rr.length; i++) {
				polygons[i] = new ymaps.Polygon(
					ymaps.geometry.Polygon.fromEncodedCoordinates(rr[i].points),
					{
						balloonContent:	rr[i].name 
					},
					style1);

				map.geoObjects.add(polygons[i]);
				
				polygons[i].events.add("click", function (mEvent) {
					me.placeunload.onMapClick(mEvent, page);
				});
				for (var j = 0; j < pp.length; j++) {
					if ( polygons[i].geometry.contains(placemarks[j].geometry.getCoordinates()) ) {
						if ($('a_' + pp[j].id + '_buyers_route_id').value != rr[i].id) {
							$('a_' + pp[j].id + '_buyers_route_id').value = rr[i].id;
						};
					};
				};
            };
		},
		
		setCoords: function(coords, page){
			$('a_' + current_id + '_longitude').value = coords[1];
			$('a_' + current_id + '_latitude').value  = coords[0];
			me.common.on_needsave(current_id);
			switch(page){
				case "index":
					for (var i = 0; i < rr.length; i++) {
						if ( polygons[i].geometry.contains(coords) ) {
							$('a_' + current_id + '_buyers_route_id').value = rr[i].id;
						};
					};
				break;
				case "prov":
					$('a_' + current_id + '_fulladdress').value = $('a_' + current_id + '_longitude').value + ' ' + $('a_' + current_id + '_latitude').value;
				break;
			}
		},
		
		onMapClick: function(mEvent, page) {
        	var coords=mEvent.get('coordPosition');
			for (var i = 0; i < pp.length; i++) {
				if (pp[i].id == current_id) {
					placemarks[i].geometry.setCoordinates(coords);
				};
			}
			me.placeunload.setCoords(coords, page);
		}
	}
}