Ext.define('app.controller.Placeunload.LinksCleaning', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Placeunload.LinksCleaning.Sites',
		'Placeunload.LinksCleaning.Deliveries',
		'Placeunload.LinksCleaning.Placeunloads'
	],
	
	models: [
		'valueModel',
		'Placeunload.linksCleaning.DeliveryModel',
		'Placeunload.linksCleaning.PlaceunloadModel'
	],
	
	views: [
		'Placeunload.LinksCleaning.Container'
	],
	
	mainContainer: null,
	
	detailStore: null,
	masterStore: null,
	
	map: null,
	center: [55.7, 37.6],
	
	ArrowOverlay: null,
	myFactory: null,
	
	trackLines: null,
	placeunloadsCollection: null,
	
	showServerError: function(responseText) {
		Ext.Msg.alert('Ошибка', responseText);
	},
	
	setBounds: function(bounds){
		var controller = this;
		
		controller.map.setBounds(bounds);
		ymaps.getZoomRange('yandex#map', controller.map.getCenter()).then(
			function(zoomRange){
				var currentZoom=controller.map.getZoom();
				if(currentZoom>zoomRange[1]){
					controller.map.setZoom(zoomRange[1]);
				}
			}
		);
	},
	
	loadMaster: function(){
		var controller = this;
		
		controller.masterStore.proxy.extraParams={
			ddateb: Ext.getCmp('ddatebDeliveries').getValue(),
			ddatee: Ext.getCmp('ddateeDeliveries').getValue(),
			site_id: Ext.getCmp('siteDeliveries').getValue()
		};
		controller.masterStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при получении доставок");
				}
				return true;
			}
		);
	},
	
	loadDetail: function(masterId, detailTable){
		var controller=this;
		
		controller.trackLines.removeAll();
		controller.placeunloadsCollection.removeAll();
		
		controller.detailStore.proxy.extraParams={
			master_id: masterId
		};
		controller.detailStore.load(
			function(records, operation, success){
				if(success!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при получении точек разгрузки");
				} else {
					var point, latitude, longitude;
					
					for(var i=0; i<records.length; i++){
						latitude = records[i].get('latitude');
						longitude = records[i].get('longitude');
						if(latitude!=null && longitude!=null){
							point = new ymaps.Placemark(
								[latitude, longitude],
								{
									id: records[i].get('id'),
									name: records[i].get('name'),
									address: records[i].get('address'),
									iconContent: records[i].get('name')
								}
							);
							controller.placeunloadsCollection.add(point);
						}
					}
					
					if(controller.map.geoObjects.getBounds()!=null){
						controller.setBounds(controller.map.geoObjects.getBounds());
					}
				}
				
				detailTable.setDisabled(false);
			}
		);
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.Placeunload.LinksCleaning.Container');
		
		function getId(r){
			return (r!=null)?
					((r.getId()!=null && r.getId()!=0)?
						r.getId():
						r.get('id')
					):
					null;
		};
		
		controller.control({
			'#filterDeliveries': {
				click: controller.loadMaster
			},
			'#DeliveriesTable': {
				selectionchange: function(sm, selected, eOpts){
					if(selected!=null && selected.length>0){
						controller.loadDetail(
							getId(selected[0]),
							Ext.getCmp('PlaceunloadsTable')
						);
					} else {
						controller.detailStore.removeAll();
						Ext.getCmp('PlaceunloadsTable').setDisabled(true);
					}
					Ext.getCmp('makeMainPlaceunloads').setDisabled(true);
					return true;
				}
			},
			'#PlaceunloadsTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('makeMainPlaceunloads').setDisabled(selected==null || selected.length==0);
					return true;
				}
			},
			'#refreshPlaceunloads': {
				click: function(){
					var selected=Ext.getCmp('DeliveriesTable').getSelectionModel().getSelection();
					if(selected!=null && selected.length>0){
						controller.loadDetail(
							getId(selected[0]),
							Ext.getCmp('PlaceunloadsTable')
						);
					}
				}
			},
			'#makeMainPlaceunloads': {
				click: function(){
					var mainPlaceunload, extraPlaceunloads = [];
					controller.detailStore.each(
						function(r){
							if(r.get('extra')){
								extraPlaceunloads.push({id: r.get('id')});
							} else {
								if(r.get('main')){
									mainPlaceunload = r;
								}
							}
							return true;
						}
					);
					if(mainPlaceunload!=null && extraPlaceunloads.length>0){
						Ext.Ajax.request({
							url: '/placeunload/links_cleaning/clean',
							timeout: 300000,
							method: 'POST',
							jsonData: {
								placeunloads: extraPlaceunloads,
								main_placeunload: mainPlaceunload.get('id')
							},
							callback: function(options, success, response){
								if(success===true){
									Ext.Msg.alert("", "Объединение адресов успешно проведено");
									controller.detailStore.removeAll();
									controller.loadMaster();
								} else {
									controller.showServerError(response.responseText);
								}
							}
						});
					} else {
						Ext.Msg.alert("Ошибка", "Не выбран основной или дополнительные адреса");
					}
				}
			}
		});
	},
	
	loadDictionaries: function(){
		var controller=this;
		
		controller.sitesStore.load();
	},
	
	initMap: function(){
		var controller=this;
		
		controller.mainContainer.setLoading(true);
		ymaps.ready(function(){
			controller.map = new ymaps.Map("placeunloadLinksCleaningMap",
				{
					center: controller.center,
					zoom: 13,
			        behaviors: ["default", "scrollZoom"]
				}
			);
			
			// Добавление элементов управления
			controller.map.controls.add("zoomControl");
			controller.map.controls.add("typeSelector");
			
			if(controller.masterStore!=null && controller.masterStore.getCount()>0){
				controller.initPageData();
			}
			
			controller.trackLines = new ymaps.GeoObjectCollection();
			
			controller.ArrowOverlay = function(geometry, data, options) {
				controller.ArrowOverlay.superclass.constructor.call(this, geometry, data, options);

				var lastArrowOffset = 0;
				//будем следить за этой опцией, вообще для этого есть option.Monitor, но можно и так
				this.options.events.add('change', function() {
					if(this._graphicsOverlay) {
						if(lastArrowOffset != this.options.get('arrowOffset')) {
							lastArrowOffset = this.options.get('arrowOffset');
							this.applyGeometry();
						}
					}

				}, this);
			};
			
			ymaps.util.augment(controller.ArrowOverlay, ymaps.overlay.Base, {

                setMap: function (map) {
                    controller.ArrowOverlay.superclass.setMap.call(this, map);
                    //заместо себя создадим графический оверлей и свяжем его с картой
                    if (map) {
                        this._graphicsOverlay = ymaps.geoObject.overlayFactory.staticGraphics.createOverlay(this.getArrowGeometry(), this._data);
                        this._graphicsOverlay.options.setParent(this.options);
                        this._graphicsOverlay.setMap(this._map);
                    } else {
                        if (this._graphicsOverlay) {
                            this._graphicsOverlay.setMap(null);
                            this._graphicsOverlay = null;
                        }
                    }
                },

                getArrowGeometry: function () {
					//в данной функции используется закрытые модули graphics.Path и graphics.generator
					//на самом деле их использовать очень сильно не рекомендуется
					var lines = this.getGeometry().getCoordinates(),
						strokeWidth = this.options.get('strokeWidth'),
						arrowWidth = strokeWidth * 1.5,
						result = [],
						point, lastPoint,
						vector, length, normal,
						arrow1, arrow2;
                    for (var i = 1; i < lines.length; ++i) {
						point = lines[i];
						lastPoint = lines[i - 1];
						vector = [point[0] - lastPoint[0], point[1] - lastPoint[1]];
						length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
						
						if(length>10*strokeWidth){
							normal = [-arrowWidth * vector[0] / length, -arrowWidth * vector[1] / length];
							arrow1 = [-normal[1], normal[0]];
							arrow2 = [ normal[1], -normal[0]];
							result.push([point[0] - arrow1[0] + normal[0] * 2, point[1] - arrow1[1] + normal[1] * 2]);
							result.push(point);
							result.push([point[0] - arrow2[0] + normal[0] * 2, point[1] - arrow2[1] + normal[1] * 2]);
							result.push(0);
						}
						result.push(point);
						result.push(lastPoint);
						result.push(0);
                    }
                    return new ymaps.geometry.pixel.LineString(result, 'nonZero');
                },

                applyGeometry: function () {
                    //пробрасываем геометрию
                    this._graphicsOverlay.setGeometry(this.getArrowGeometry());
                }
            });
            
            controller.myFactory = new ymaps.geoObject.OverlayFactory();
            controller.myFactory.add("LineString", controller.ArrowOverlay);
			
			controller.placeunloadsCollection = new ymaps.GeoObjectCollection(
				{},
				{
					balloonContentLayout: ymaps.templateLayoutFactory.createClass(
						'<p>Наименование: $[properties.name]</p>' +
						'<p>Адрес: $[properties.address]</p>'
					),
					preset: 'twirl#greyStretchyIcon'
				}
			);
			
			controller.map.geoObjects.add(controller.trackLines);
			controller.map.geoObjects.add(controller.placeunloadsCollection);
			
			controller.mainContainer.setLoading(false);
		});
	},
	
	refreshMapObjectsPlaceunload: function(){
		var controller = this,
			mainPointCoords,
			extraPointsCoords = {},
			haveExtra = false,
			r, coords;
		
		controller.placeunloadsCollection.each(
			function(p){
				r = controller.detailStore.getById(p.properties.get('id'));
				coords = p.geometry.getCoordinates();
				if(r.get('main')){
					mainPointCoords = coords;
					p.options.set('preset', 'twirl#redStretchyIcon');
				} else {
					if(r.get('extra')){
						extraPointsCoords[r.get('id')] = coords;
						haveExtra = true;
						p.options.set('preset', 'twirl#blueStretchyIcon');
					} else {
						p.options.set('preset', 'twirl#greyStretchyIcon');
					}
				}
			}
		);
		
		controller.trackLines.removeAll();
		if(mainPointCoords!=null && haveExtra){
			for(var c in extraPointsCoords){
				controller.trackLines.add(
					new ymaps.GeoObject(
						{
							geometry:
							{
								type: 'LineString',
								coordinates: [extraPointsCoords[c], mainPointCoords]
							}
						},
						{
							overlayFactory: controller.myFactory,
							strokeWidth : 4,
							opacity : 0.5,
							strokeColor : '0000FF'
						}
					)
				);
			}
		}
	},
	
	initTables: function(){
		var controller = this,
			placeunloadsTable = Ext.getCmp('PlaceunloadsTable');
		
		placeunloadsTable.columns[2].addListener(
			"checkchange",
			function(column, rowIndex, checked, eOpts ){
				if(checked){
					var data = controller.detailStore.data,
						haveExtra = false;
					for(var i=0; i<data.length; i++){
						if(i==rowIndex){
							data.getAt(i).set('extra', false);
						} else {
							data.getAt(i).set('main', false);
							haveExtra = haveExtra || data.getAt(i).get('extra');
						}
					}
					Ext.getCmp('makeMainPlaceunloads').setDisabled(!haveExtra);
				} else {
					Ext.getCmp('makeMainPlaceunloads').setDisabled(true);
				}
				controller.refreshMapObjectsPlaceunload();
			}
		);
		
		placeunloadsTable.columns[3].addListener(
			"checkchange",
			function(column, rowIndex, checked, eOpts ){
				var mainId=false, haveExtra = false,
					r,
					data = controller.detailStore.data;
				if(checked){
					r = controller.detailStore.getAt(rowIndex);
					r.set('main', false);
				}
				for(var i=0; i<data.length; i++){
					haveExtra = haveExtra || data.getAt(i).get('extra');
					if(data.getAt(i).get('main')){
						mainId = data.getAt(i).get('id');
					}
				}
				Ext.getCmp('makeMainPlaceunloads').setDisabled(!(mainId!=null && haveExtra));
				controller.refreshMapObjectsPlaceunload();
			}
		);
	},
	
	initStores: function(){
		var controller=this;
		
		controller.detailStore=Ext.getCmp('PlaceunloadsTable').getStore();
		controller.masterStore=Ext.getCmp('DeliveriesTable').getStore();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initMap();
		
		controller.initStores();
		
		controller.initTables();
	}
});