function Unact(){
	this.geo = {
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
					setCoords(coords);
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
					setCoords(coords);
				}
			});
		},
		
		find_addr: function(sid){
			var srcaddress = $('a_' + sid + '_srcaddress').value;
			var geocoder = new ymaps.geocode(srcaddress);
			
			this.on_select( sid );
			
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
								placemarks[i].balloon.open(geoResultPoint);
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
		
		on_select: function(sid){
			var pred_id=0;
			var longitude = parseFloat($('a_' + sid + '_longitude').value);
			var latitude = parseFloat($('a_' + sid + '_latitude').value);
			
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
			$$('tr.rdata').each(function(d){
				d.style.backgroundColor = 'white'; // был transparent
			});
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
			};
		},
		
		setCoords: function(coords){
        	$('a_' + current_id + '_latitude').value  = coords[0];
			$('a_' + current_id + '_longitude').value = coords[1];
			$('a_' + current_id + '_ismanual').checked = true;
			this.on_needsave(current_id);
       },
        
		on_needsave: function( sid ){
			$('a_' + sid + '_needsave').checked = true;
		}
	}
}