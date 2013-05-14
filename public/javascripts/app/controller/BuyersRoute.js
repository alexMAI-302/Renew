Ext.define('app.controller.BuyersRoute', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'BuyersRoute.Sites',
		'BuyersRoute.Tariffs',
		'BuyersRoute.BuyersRoutes',
		'BuyersRoute.Placeunloads'
	],
	
	models: [
		'valueModel',
		'BuyersRoute.BuyersRouteModel',
		'BuyersRoute.PlaceunloadModel'
	],
	
	views: [
		'BuyersRoute.Container'
	],
	
	mainContainer: null,
	
	masterStore: null,
	sitesStore: null,
	tariffsStore: null,
	placeunloadsStore: null,
	
	map: null,
	routesCollection: null,
	currentZone: null,
	style1:
	{
		strokeColor: "ff000055",
		fillColor: "ffff0055"
	},
	style2: 
	{
		strokeColor: "ffff0055",
		fillColor: "ff000055"
	},

	
	storeHasChanges: function(store){
		return (store.getNewRecords().length > 0) ||
			(store.getUpdatedRecords().length > 0) ||
			(store.getRemovedRecords().length > 0)
	},
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	syncMaster: function(){
		var controller=this,
			intersections = controller.checkPolygonsIntersections(controller.routesCollection);
		
		if(intersections==null){
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
		} else {
			var zone1 = controller.masterStore.getById(intersections[0]),
				zone2 = controller.masterStore.getById(intersections[1]);
			Ext.Msg.alert(
				"Внимание",
				"Зоны "+zone1.get('name')+" и "+zone2.get('name')+
				" имеют пересечение.<br/>Уберите пересечение и попробуйте еще раз."
			);
		}
	},

	filterMaster: function(){
		var controller = this,
			site = Ext.getCmp('filterSiteBuyersRoute').getValue(),
			spvId = Ext.getCmp('filterTariffBuyersRoute').getValue();
		
		if(site>0 && spvId>0){
			controller.mainContainer.setLoading(true);
			
			controller.routesCollection.removeAll();
		
			controller.masterStore.proxy.extraParams = {
				site: site,
				spv_id: spvId
			};
			controller.masterStore.load(
				function(records, operation, success){
					if(success!==true){
						Ext.Msg.alert("Ошибка", "Ошибка при получении зон доставки");
					} else {
						var p, pointsStr,
							site = controller.sitesStore.getById(Ext.getCmp('filterSiteBuyersRoute').getValue()),
							center = [site.get('latitude'), site.get('longitude')]
							centerPolygon = [site.get('latitude'), site.get('longitude')];
						
						for(var i=0; i<records.length; i++){
							pointsStr = records[i].get('points');
							p = new ymaps.Polygon(
								(pointsStr != null && pointsStr != '')?
								ymaps.geometry.Polygon.fromEncodedCoordinates(pointsStr):
								[[centerPolygon]],
								{
									id: records[i].get('id')
								},
								{
									strokeColor: controller.style2.strokeColor.toString(),
									fillColor: controller.style2.fillColor.toString()
								}
							);
							p.events.add(
								"geometrychange",
								function(e){
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
									r.set('point_str', str);
									controller.computeZonePoints(geometry);
								}
							);
							
							controller.routesCollection.add(p);
						}
						controller.map.setCenter(centerPolygon, 10);
					}
					controller.mainContainer.setLoading(false);
				}
			)
		}
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
			i, j, k, l;
		
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
						//проверяем попарно пересечение сторон
						//цикл получения вершин первого многоугольника
						for(k=0; k<polygonsCoordinates[i].coords.length-1; k++){
							//цикл получения вершин второго многоугольника
							for(l=0; l<polygonsCoordinates[j].coords.length-1; l++){
								if(
									this.checkLineIntersection(
										polygonsCoordinates[i].coords[k],
										polygonsCoordinates[i].coords[k+1],
										polygonsCoordinates[j].coords[l],
										polygonsCoordinates[j].coords[l+1])
								){
									return [polygonsCoordinates[i].id, polygonsCoordinates[j].id];
								}
							}
						}
					}
				}
			}
		}
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
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.BuyersRoute.Container');
		
		controller.control({
			'#filterBuyersRoute': {
				click: controller.filterMaster
			},
			'#BuyersRoutesTable': {
				selectionchange: function(sm, selected, eOpts){
					var id=(selected[0]!=null)?selected[0].get('id'):null,
						point;
					
					if(controller.currentZone!=null){
						controller.currentZone.editor.stopEditing();
					}
					controller.routesCollection.each(
						function(o){
							if(o.properties.get('id')==id){
								controller.currentZone = o;
								o.options.set("fillColor", controller.style1.fillColor.toString());
								o.editor.startEditing();
							} else {
								o.options.set("fillColor", controller.style2.fillColor.toString());
							}
						}
					);
					controller.computeZonePoints(controller.currentZone.geometry);
				}
			},
			'#saveBuyersRoute': {
				click: controller.syncMaster
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
					center: [55.76, 37.64],
					zoom: 13,
			        behaviors: ["default", "scrollZoom"]
				}
			);
			// Добавление элементов управления
			controller.map.controls.add("zoomControl");
			controller.map.controls.add("typeSelector");
			controller.routesCollection = new ymaps.GeoObjectCollection(controller.style1);
			controller.map.geoObjects.add(controller.routesCollection);
			controller.mainContainer.setLoading(false);
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore = controller.getBuyersRouteBuyersRoutesStore();
		controller.sitesStore = controller.getBuyersRouteSitesStore();
		controller.tariffsStore = controller.getBuyersRouteTariffsStore();
		controller.placeunloadsStore = controller.getBuyersRoutePlaceunloadsStore();
	},
	
	bindStores: function(){
		var controller=this,
			buyersRouteTable = Ext.getCmp('BuyersRoutesTable');
		
		buyersRouteTable.reconfigure(controller.masterStore);
		Ext.getCmp('filterSiteBuyersRoute').bindStore(controller.sitesStore);
		Ext.getCmp('filterTariffBuyersRoute').bindStore(controller.tariffsStore);
	},
	
	loadDictionaries: function(){
		var controller=this,
			count=3;
		
		controller.mainContainer.setLoading(true);
		function checkLoading(val){
			if(val==0){
				controller.mainContainer.setLoading(false);
			}
		};
		
		controller.sitesStore.load(
			function(records, operation, success){
				count--;
				checkLoading(count);
			}
		);
		controller.tariffsStore.load(
			function(records, operation, success){
				count--;
				checkLoading(count);
			}
		);
		
		controller.placeunloadsStore.load(
			function(records, operation, success){
				count--;
				checkLoading(count);
			}
		);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initMap();
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.loadDictionaries();
	}
});