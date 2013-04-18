Ext.define('app.controller.GeoPoint', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'GeoPoint.GeoPoints',
		'Branches'
	],
	
	models: [
		'valueModel',
		'GeoPoint.GeoPointModel'
	],
	
	views: [
		'GeoPoint.Container'
	],
	
	mainContainer: null,
	
	masterStore: null,
	branchesStore: null,
	pointTypesStore: null,
	
	mainCity: [],
	map: null,
	center: [55.7, 37.6],
	clusterer: null,
	
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
	
	syncMaster: function(container, selectedMasterId){
		var controller=this;
		
		if (controller.storeHasChanges(controller.masterStore)){
			container.setLoading(true);
			controller.masterStore.proxy.extraParams={};
			controller.masterStore.sync({
				callback: function(batch){
					if(batch.exceptions.length>0){
						Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						container.setLoading(false);
					}
					container.setLoading(false);
				}
			});
		}
	},
	
	filterMaster: function(){
		var controller=this,
			branch = Ext.getCmp('filterBranchGeoPoint').getValue(),
			pointKind = Ext.getCmp('filterPointsGeoPoint').getValue(),
			terminalId = Ext.getCmp('filterTerminalIdGeoPoint').getValue();
		
		if((branch!=null && pointKind!=null) || terminalId!=null){
			controller.mainCity = [];
			controller.clusterer.removeAll();
			
			controller.mainContainer.setLoading(true);
			
			controller.masterStore.proxy.extraParams={
				branch: branch,
				point_kind: pointKind,
				filter_str: Ext.getCmp('filterTerminalStrGeoPoint').getValue(),
				terminal_id: terminalId
			};
			controller.masterStore.load(
				function(records, operation, success){
					if(!success){
						Ext.Msg.alert("Ошибка", "Ошибка при получении координат терминалов");
					} else {
						var cities=new Ext.util.MixedCollection(),
							points =[],
							city,
							latitude, longitude, maxLatitude=-180, maxLongitude=-90, minLatitude=180, minLongitude=90;
						
						controller.masterStore.each(function(r){
							city = r.get('city');
							cities.add(city, city);
							latitude = r.get('latitude');
							longitude = r.get('longitude');
							
							r.point = new ymaps.Placemark(
								(latitude!=null && longitude!=null &&
								latitude!="" && longitude!="")?
									[latitude, longitude]:
									controller.center,
								{
									draggable: false,
									balloonMaxWidth: 100,
									balloonAutoPan: true,
									balloonContent: r.get('name'),
									balloonContentBody: r.get('name'),
									id: r.get('id'),
									clusterCaption: r.get('terminalID')
								},
								{
									preset: "twirl#shopIcon"
								}
							);
							r.point.events.add("dragend", function (mEvent) {
								var coords=mEvent.originalEvent.target.geometry.getCoordinates();
								r.set('latitude', coords[0]);
								r.set('longitude', coords[1]);
								r.set('ismaunual', 1);
							});
							r.point.events.add("click", function (mEvent) {
								var table = Ext.getCmp('GeoPointTable');
								
								table.getPlugin('bufferedrendererGeoPoint').scrollTo(
									controller.masterStore.indexOf(r),
									true
								);
							});
							
							latitude = (latitude!=null && latitude!="")? latitude : controller.center[0];
							longitude = (longitude!=null && longitude!="")? longitude : controller.center[1];
							minLatitude = (minLatitude>latitude)?latitude:minLatitude;
							minLongitude = (minLongitude>longitude)?longitude:minLongitude;
							maxLatitude = (maxLatitude<latitude)?latitude:maxLatitude;
							maxLongitude = (maxLongitude<longitude)?longitude:maxLongitude;
							points.push(r.point);
							return true;
						});
						
						controller.clusterer.add(points);
						controller.mainCity = cities.collect('city');
					}
					
					controller.map.setBounds([[minLatitude, minLongitude], [maxLatitude, maxLongitude]]);
					
					controller.mainContainer.setLoading(false);
					return true;
				}
			);
		}
	},
	
	setPointCoords: function(currentId, point, coords){
		if(currentId==point.properties.get('id')){
			point.geometry.setCoordinates(coords);
		}
	},
	
	selectPoint: function(currentId, point, coords){
		var controller = this;
		if(currentId==point.properties.get('id')){
			var clusterInfo = controller.clusterer.getObjectState(point);
			if(clusterInfo.isClustered){
				clusterInfo.cluster.balloon.open();
			} else {
				var latitude = (coords!=null)?coords[0]:null,
					longitude = (coords!=null)?coords[1]:null;
				
				if(latitude==null || latitude=="" || longitude==null || longitude==""){
					latitude = controller.center[0];
					longitude = controller.center[1];
				}
				
				point.options.set("preset", "twirl#workshopIcon");
				point.options.set("draggable", true);
				if(!point.balloon.isOpen()){
					point.balloon.open([latitude, longitude]);
				}
			}
		} else {
			point.options.set("preset", "twirl#shopIcon");
			point.options.set("draggable", false);
		}
	},
	
	iterateOverClusterPoints: function(currentId, fn, coords){
		var controller = this,
			iterator = controller.clusterer.getIterator(),
			o = iterator.getNext(),
			points,
			i;
		function iterate(){
			while(o!=null){
				if(o.getGeoObjects!=null){
					points = o.getGeoObjects();
					for(i=0; i<points.length; i++){
						fn.call(controller, currentId, points[i], coords);
					}
				} else {
					fn.call(controller, currentId, o, coords);
				}
				
				o = iterator.getNext();
			}
		};
		
		if(o==null){
			setTimeout(function(){
				iterator = controller.clusterer.getIterator();
				o = iterator.getNext();
				iterate();
			}, 1000);
		} else {
			iterate();
		}
		
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.GeoPoint.Container');
		
		function getId(r){
			return (r!=null)?
					((r.getId()!=null && r.getId()!=0)?
						r.getId():
						r.get('id')
					):
					null;
		}
		
		controller.control({
			'#refreshGeoPoint': {
				click: controller.filterMaster
			},
			'#GeoPointTable': {
				selectionchange: function(sm, selected, eOpts){
					var current=(selected!=null)?selected[0]:null,
						currentId = (current!=null)?current.get('id'):null,
						coords;
					
					if(current!=null){
						coords = [current.get('latitude'), current.get('longitude')];
						controller.map.zoomRange.get(coords).then(
							function(range){
								controller.map.setCenter(coords, range[1]);
								controller.iterateOverClusterPoints(currentId, controller.selectPoint, coords);
							}
						);
					}
					
					return true;
				},
				edit: function(editor, e, eOpts){
					function changePoint(coords){
						var currentId=e.record.get('id');
						
						controller.iterateOverClusterPoints(currentId, controller.setPointCoords, coords);
						
						e.record.set('ismanual', 1);
					};
					
					switch(e.colIdx){
						case 3:
							var geocoder = new ymaps.geocode(e.value);
							
							// Создание обработчика для успешного завершения геокодирования
				            geocoder.then(
				            	function (res) {
									var n = res.geoObjects.getLength();
									var geoResultInfo, geoResultPoint;
									if (n>0) {
											geoResultInfo = res.geoObjects.get(0).properties.get("metaDataProperty").GeocoderMetaData;
											geoResultPoint = res.geoObjects.get(0).geometry.getCoordinates();
									} else {
										Ext.Msg.alert("Ошибка", "Ничего не найдено!");
										return;
									};
									if (geoResultInfo.kind == "country" || geoResultInfo.kind == "province" || geoResultInfo.kind == "district") {
										Ext.Msg.alert("Ошибка", "Слишком общий адрес!");
										return;
									};
									if (geoResultInfo.kind == 'locality') {
										for (var i = 0; i < controller.mainCity.length; i++) { 
											try {
												if (geoResultInfo.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName == controller.mainCity[i]) {
													Ext.Msg.alert("Ошибка", "Не могу найти улицу в городе!");
													return;
												};
											}
											catch(e) {
											};
										};
									};
									
									e.record.set('latitude', geoResultPoint[0]);
									e.record.set('longitude', geoResultPoint[1]);
									e.record.set('fulladdress', geoResultInfo.text);
									
									changePoint(geoResultPoint);
								},
								function (error) {
									Ext.Msg.alert("Ошибка", error);
								}
							);
						break;
						case 5:
							changePoint([e.value, e.record.get('longitude')]);
						break;
						case 6:
							changePoint([e.record.get('latitude'), e.value]);
						break;
					}
					return true;
				}
			},
			'#saveGeoPoint': {
				click: function(){
					var selected=Ext.getCmp('GeoPointTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(
						controller.mainContainer,
						(selected!=null)?selected.get('id'):null);
					return true;
				}
			},
			"#geoPointMap": {
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
			controller.map = new ymaps.Map("geoPointMap",
				{
					center: controller.center,
					zoom: 13,
			        behaviors: ["default", "scrollZoom"]
				}
			);
			
			// Добавление элементов управления
			controller.map.controls.add("zoomControl");
			controller.map.controls.add("typeSelector");
			
			controller.map.events.add("click", function (mEvent) {
				var s = Ext.getCmp('GeoPointTable').getSelectionModel().getSelection()[0];
					
				if(s!=null){
					var currentId = (s!=null)?s.get('id'):null,
						coords=mEvent.get('coordPosition');
						
					s.set('latitude', coords[0]);
					s.set('longitude', coords[0]);
					
					controller.iterateOverClusterPoints(currentId, controller.setPointCoords, coords);
				}
			});
			
			controller.clusterer = new ymaps.Clusterer({
				maxZoom: 13
			});
			controller.map.geoObjects.add(controller.clusterer);
			
			if(controller.masterStore!=null){
				controller.initPageData();
			}
			controller.mainContainer.setLoading(false);
		});
	},
	
	initPageData: function(){
		var controller=this,
			terminalId = parseInt(Ext.get('terminal_id').getValue());
		
		if(terminalId>0){
			Ext.getCmp('filterTerminalIdGeoPoint').setValue(terminalId);
			Ext.getCmp('filterPointsGeoPoint').setValue(2);
			
			controller.filterMaster();
		}
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore = controller.getGeoPointGeoPointsStore();
		controller.branchesStore = controller.getBranchesStore();
		controller.pointTypesStore = Ext.create('Ext.data.Store', {
		    model: 'app.model.valueModel',
		    data: [
		    	{id: 1, name: 'Незаполненные'},
		    	{id: 2, name: 'Все'},
		    	{id: 3, name: 'Только заполненные'}
		    ],
			proxy: {
		        type: 'memory'
			}
		});
	},
	
	bindStores: function(){
		var controller=this,
			geoPointKind = Ext.getCmp('filterPointsGeoPoint'),
			branch = Ext.getCmp('filterBranchGeoPoint');
		
		Ext.getCmp('GeoPointTable').reconfigure(controller.masterStore);
		
		geoPointKind.bindStore(controller.pointTypesStore);
		geoPointKind.setValue(1);
		branch.bindStore(controller.branchesStore);
		if(controller.map!=null){
			controller.initPageData();
		}
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initMap();
		
		controller.initStores();
		
		controller.bindStores();
	}
});