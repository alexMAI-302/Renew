Ext.define('app.controller.BuyersRoute', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'BuyersRoute.BuyersRoutes',
		'BuyersRoute.Placeunloads'
	],
	
	models: [
		'BuyersRoute.BuyersRouteModel',
		'BuyersRoute.PlaceunloadModel'
	],
	
	views: [
		'BuyersRoute.Container'
	],
	
	mainContainer: null,
	
	masterStore: null,
	placeunloadsStore: null,
	
	map: null,
	routesCollection: null,
	currentZone: null,
	
	center: [55.76, 37.64],
	
	storeHasChanges: function(store){
		return (store.getNewRecords().length > 0) ||
			(store.getUpdatedRecords().length > 0) ||
			(store.getRemovedRecords().length > 0);
	},
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	syncMaster: function(){
		var controller=this,
			intersections = controller.checkPolygonsIntersections(controller.routesCollection);
		
		if(intersections!=null && intersections.length>0){
			var zones = [];
			for(var i=0; i<intersections.length; i++){
				zones.push(
					controller.masterStore.getById(intersections[i][0]).get('name')+
					' и '+
					controller.masterStore.getById(intersections[i][1]).get('name')
				);
			}
			Ext.Msg.alert(
				"Ошибка",
				"Зоны "+zones.join()+" имеют пересечение.\n Данные не сохранены."
			);
		} else {
			if (controller.storeHasChanges(controller.masterStore)){
				controller.mainContainer.setLoading(true);
				controller.masterStore.sync({
					callback: function(batch){
						if(batch.exceptions.length>0){
							Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							controller.mainContainer.setLoading(false);
						}
						controller.mainContainer.setLoading(false);
					}
				});
			}
		}
	},
	
	rewriteBuyersRoutes: function(){
		var controller=this,
			intersections = controller.checkPolygonsIntersections(controller.routesCollection);
		
		if(intersections!=null && intersections.length>0){
			var zones = [];
			for(var i=0; i<intersections.length; i++){
				zones.push(
					controller.masterStore.getById(intersections[i][0]).get('name')+
					' и '+
					controller.masterStore.getById(intersections[i][1]).get('name')
				);
			}
			Ext.Msg.alert(
				"Ошибка",
				"Зоны "+zones.join()+" имеют пересечение."
			);
		} else {
			var r, str, coords;
			
			controller.mainContainer.setLoading(true);
			
			controller.routesCollection.each(function(o){
				r = controller.masterStore.getById(o.properties.get('id'));
				str='';
				coords = o.geometry.getCoordinates()[0];
				
				r.set(
					'points',
					ymaps.geometry.Polygon.toEncodedCoordinates(o.geometry)
				);
				for(var j=0; coords.length>1 && j<coords.length; j++){
					str+=j+", "+coords[j][0]+", "+coords[j][1]+";";
				}
				r.set('points_str', str);
				r.setDirty();
			});
			
			controller.masterStore.sync({
				callback: function(batch){
					if(batch.exceptions.length>0){
						Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						controller.mainContainer.setLoading(false);
					} else {
						Ext.Ajax.request({
							url: '/buyers_route/rebuild_placeunload_routes',
							timeout: 600000,
							method: 'POST',
							params: {
								authenticity_token: window._token
							},
							callback: function(options, success, response){
								if(success!==true){
									controller.showServerError(response, response.responseText);
								}
								controller.mainContainer.setLoading(false);
							}
						});
					}
				}
			});
		}
	},

	filterMaster: function(){
		var controller = this;
		
		controller.mainContainer.setLoading(true);
		controller.currentZone = null;
		controller.routesCollection.removeAll();
		
		controller.masterStore.load(
			function(records, operation, success){
				if(success!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при получении зон доставки");
				} else {
					var p, pointsStr;
					
					for(var i=0; i<records.length; i++){
						pointsStr = records[i].get('points');
						p = new ymaps.Polygon(
							(pointsStr != null && pointsStr != '')?
							ymaps.geometry.Polygon.fromEncodedCoordinates(pointsStr):
							[[[records[i].get('site_latitude'), records[i].get('site_longitude')]]],
							{
								id: records[i].get('id')
							},
							{
								strokeColor: '#000000',
								fillColor: records[i].get('color'),
								opacity: 0.3
							}
						);
						p.events.add(
							"geometrychange",
							function(e){
								if(controller.currentZone!=null){
									var r = controller.masterStore.getById(controller.currentZone.properties.get('id')),
										str='',
										geometry = e.originalEvent.target.geometry,
										coords = geometry.getCoordinates()[0];
									r.set(
										'points',
										ymaps.geometry.Polygon.toEncodedCoordinates(geometry)
									);
									for(var j=0; coords.length>1 && j<coords.length; j++){
										str+=j+", "+coords[j][0]+", "+coords[j][1]+";";
									}
									r.set('points_str', str);
									controller.computeZonePoints(geometry);
								}
							}
						);
						
						p.events.add(
							"click",
							function(e){
								var id = e.originalEvent.target.properties.get("id");
								if(id!=null){
									Ext.getCmp('BuyersRoutesTable').getSelectionModel().select(controller.masterStore.getById(id));
								}
							}
						);
						
						controller.routesCollection.add(p);
					}
					controller.map.setCenter(controller.center, 10);
				}
				controller.mainContainer.setLoading(false);
			}
		);
	},
	
	checkLineIntersection: function(start1, end1, start2, end2){
		var dir1 = [end1[0] - start1[0], end1[1] - start1[1]],
			dir2 = [end2[0] - start2[0], end2[1] - start2[1]],
		//считаем уравнения прямых проходящих через отрезки
			a1 = -dir1[1],
			b1 = +dir1[0],
			d1 = -(a1 * start1[0] + b1 * start1[1]),
			a2 = -dir2[1], b2 = +dir2[0],
			d2 = -(a2 * start2[0] + b2 * start2[1]),
		//подставляем концы отрезков, для выяснения в каких полуплоскотях они
			seg1_line2_start = a2 * start1[0] + b2 * start1[1] + d2,
			seg1_line2_end = a2 * end1[0] + b2 * end1[1] + d2,
			seg2_line1_start = a1 * start2[0] + b1 * start2[1] + d1,
			seg2_line1_end = a1 * end2[0] + b1 * end2[1] + d1;

		//если концы одного отрезка имеют один знак, значит он в одной полуплоскости и пересечения нет.
		return !(seg1_line2_start * seg1_line2_end >= 0 || seg2_line1_start * seg2_line1_end >= 0);
	},
	
	checkPolygonsIntersections: function(polygons){
		var polygonsCoordinates = [],
			i, j, k, l, flagNoIntersections,
			result = [];
		
		polygons.each(
			function(polygon){
				polygonsCoordinates.push({
					id: polygon.properties.get('id'),
					coords: polygon.geometry.getCoordinates()[0]
				});
			}
		);
		
		//смотрим попарно многоугольники
		//цикл для получения первого многоуольника
		for(i=0; i<polygonsCoordinates.length-1; i++){
			//если первый многоугольник имеет не меньше 3 вершин, то тогда сравниваем
			if(polygonsCoordinates[i].coords.length>=3){
				//цикл для получения второго многоугольника
				for(j=i+1; j<polygonsCoordinates.length; j++){
					//если второй многоугольник имеет не меньше 3 вершин, то тогда сравниваем
					if(polygonsCoordinates[j].coords.length>=3){
						flagNoIntersections = true;
						//проверяем попарно пересечение сторон
						//цикл получения вершин первого многоугольника
						for(k=0; k<polygonsCoordinates[i].coords.length-1 && flagNoIntersections; k++){
							//цикл получения вершин второго многоугольника
							for(l=0; l<polygonsCoordinates[j].coords.length-1 && flagNoIntersections; l++){
								if(
									this.checkLineIntersection(
										polygonsCoordinates[i].coords[k],
										polygonsCoordinates[i].coords[k+1],
										polygonsCoordinates[j].coords[l],
										polygonsCoordinates[j].coords[l+1])
								){
									result.push([polygonsCoordinates[i].id, polygonsCoordinates[j].id]);
									flagNoIntersections = false;
								}
							}
						}
					}
				}
			}
		}
		return result;
	},
	
	computeZonePoints: function(geometry){
		var controller=this,
			routePoints=[],
			coords = geometry.getCoordinates();
		if(
			coords!=null &&
			coords[0].length>2
		){
			controller.placeunloadsStore.each(
				function(r){
					point = [r.get('latitude'), r.get('longitude')];
					if(
						point[0]!=null && point[1]!=null &&
						geometry.contains(point)
					){
						routePoints.push(r.get('id'));
					}
					return true;
				}
			);
		}
		Ext.getCmp('loadCSVBuyersRoute').setHref("/buyers_route/get_info_csv?points="+routePoints.join());
		Ext.getCmp('pointsInZoneBuyersRoute').setValue(routePoints.length);
	},
	
	changeBuyersRoute: function(id){
		var controller = this;
		
		if(controller.currentZone!=null){
			controller.currentZone.editor.stopEditing();
		}
		controller.routesCollection.each(
			function(o){
				if(o.properties.get('id')==id){
					controller.currentZone = o;
					o.options.set("opacity", 0.9);
					o.editor.startEditing();
				} else {
					o.options.set("opacity", 0.3);
				}
			}
		);
		if(controller.currentZone!=null){
			controller.computeZonePoints(controller.currentZone.geometry);
		}
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.BuyersRoute.Container');
		
		controller.control({
			'#filterBuyersRoute': {
				click: controller.filterMaster
			},
			'#BuyersRoutesTable': {
				selectionchange: function(sm, selected, eOpts){
					var id=(selected[0]!=null)?selected[0].get('id'):null;
					
					controller.changeBuyersRoute(id);
				}
			},
			'#saveBuyersRoute': {
				click: controller.syncMaster
			},
			'#rewriteBuyersRoutes': {
				click: controller.rewriteBuyersRoutes
			},
			"#buyersRouteMap": {
				resize: function(){
					controller.map.container.fitToViewport();
				}
			}
		});
	},
	
	initMap: function(){
		var controller=this;
		
		controller.mainContainer.setLoading(true);
		ymaps.ready(function(){
			controller.map = new ymaps.Map("buyersRouteMap",
				{
					center: controller.center,
					zoom: 13,
			        behaviors: ["default", "scrollZoom"]
				}
			);
			// Добавление элементов управления
			controller.map.controls.add("zoomControl");
			controller.map.controls.add("typeSelector");
			controller.routesCollection = new ymaps.GeoObjectCollection();
			controller.map.geoObjects.add(controller.routesCollection);
			
			if(controller.masterStore!=null){
				controller.filterMaster();
			}
			controller.mainContainer.setLoading(false);
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore = Ext.getCmp('BuyersRoutesTable').getStore();
		controller.placeunloadsStore = controller.getBuyersRoutePlaceunloadsStore();
	},
	
	loadDictionaries: function(){
		var controller=this,
			count=1;
		
		controller.mainContainer.setLoading(true);
		
		controller.placeunloadsStore.load(
			function(records, operation, success){
				if(controller.map!=null){
					controller.filterMaster();
				}
			}
		);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initMap();
		
		controller.initStores();
		
		controller.loadDictionaries();
	}
});