Ext.define('app.controller.Geotrack', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Geotrack.Tracks',
		'Geotrack.Terminals',
		'Geotrack.Placeunloads',
		'Geotrack.Agents',
		'Geotrack.Positions'
	],
	
	models: [
		'valueModel',
		'Geotrack.AgentModel',
		'Geotrack.TrackModel',
		'Geotrack.TerminalModel',
		'Geotrack.PlaceunloadModel'
	],
	
	views: [
		'Geotrack.Container'
	],
	
	mainContainer: null,
	
	positionsStore: null,
	masterStore: null,
	detailStore: null,
	terminalsStore: null,
	placeunloadsStore: null,
	
	map: null,
	center: [55.7, 37.6],
	trackLines: null,
	trackPointsCollection: null,
	terminalCollection: null,
	placeunloadCollection: null,
	okPointsCollection: null,
	
	ArrowOverlay: null,
	myFactory: null,
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	loadTerminals: function(ddate, agentId){
		var controller = this;
		
		controller.mainContainer.setLoading(true);
		
		controller.terminalsStore.proxy.extraParams = {
			ddate: ddate,
			agent_id: agentId
		};
		controller.terminalsStore.load(
			function(records, operation, success){
				if(success!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при получении терминалов");
				} else {
					var terminal, okPoint;
					
					for(var i=0; i<records.length; i++){
						
						terminal = new ymaps.Placemark(
							[records[i].get('latitude'), records[i].get('longitude')],
							{
								id: records[i].get('id'),
								code: records[i].get('code'),
								terminalid: records[i].get('terminalid')
							}
						);
						controller.terminalCollection.add(terminal);
						
						if(records[i].get('ok_latitude')>0){
							okPoint = new ymaps.Placemark(
								[records[i].get('ok_latitude'), records[i].get('ok_longitude')],
								{
									id: records[i].get('id'),
									code: records[i].get('code'),
									terminalid: records[i].get('terminalid'),
									ok_distance: records[i].get('ok_distance'),
									cts_ok: Ext.Date.format(records[i].get('cts_ok'), 'c')
								}
							);
							controller.okPointsCollection.add(okPoint);
						}
					}
					
					if(controller.map.geoObjects.getBounds()!=null){
						controller.setBounds(controller.map.geoObjects.getBounds());
					}
				}
			}
		);
	},
	
	loadPlaceunloads: function(ddate, agentId){
		var controller = this;
		
		controller.placeunloadsStore.proxy.extraParams = {
			ddate: ddate,
			agent_id: agentId
		};
		controller.placeunloadsStore.load(
			function(records, operation, success){
				if(success!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при получении точек разгрузки");
				} else {
					var placeunload;
					
					for(var i=0; i<records.length; i++){
						
						placeunload = new ymaps.Placemark(
							[records[i].get('latitude'), records[i].get('longitude')],
							{
								id: records[i].get('id'),
								name: records[i].get('name'),
								address: records[i].get('address')
							}
						);
						controller.placeunloadCollection.add(placeunload);
					}
					
					if(controller.map.geoObjects.getBounds()!=null){
						controller.setBounds(controller.map.geoObjects.getBounds());
					}
				}
			}
		);
	},
	
	loadDetail: function(ddate, agentId){
		var controller = this;
		
		controller.detailStore.proxy.extraParams = {
			ddate: ddate,
			agent_id: agentId
		};
		controller.detailStore.load(
			function(records, operation, success){
				if(success!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при получении трэков");
				} else {
					var trackLine, distance=0, trackPoints, coordArray, showPoints = Ext.getCmp('GeoTracksTs').pressed;
					
					for(var i=0; i<records.length; i++){
						if(records[i].pointsArray!=null && records[i].pointsArray.length>0){
							coordArray=[];
							trackPoints = new ymaps.GeoObjectCollection(
								{
									properties: {
										id: records[i].get('id')
									}
								},
								{
									iconImageHref: '/images/point_blue.png',
									iconImageSize: [7, 7],
									iconImageOffset: [-3, -3],
									balloonContentLayout: ymaps.templateLayoutFactory.createClass(
										'<p>$[properties.ts]</p>'
									),
									visible: showPoints
								}
							);
							
							for(var j=0; j<records[i].pointsArray.length; j++){
								coordArray.push(records[i].pointsArray[j].coords);
								trackPoints.add(
									new ymaps.Placemark(
										records[i].pointsArray[j].coords,
										{
											id: j,
											ts: Ext.Date.format(records[i].pointsArray[j].ts, "H:i:s") 
										}
									)
								);
							}
							
							controller.trackPointsCollection.add(trackPoints);
							
							trackLine = new ymaps.GeoObject(
								{
									geometry:
									{
										type: 'LineString',
										coordinates: coordArray
									},
									properties: 
									{
										id: records[i].get('id'),
										num: i+1,
										start_time: Ext.Date.format(records[i].get('start_time'), 'H:i:s'),
										finish_time: Ext.Date.format(records[i].get('finish_time'), 'H:i:s')
									}
								},
								{
									overlayFactory: controller.myFactory,
									strokeWidth : 4,
									opacity : 0.5,
									strokeColor : '0000FF'
								}
							);
							controller.trackLines.add(trackLine);
						}
						distance+=records[i].get('track_distance');
					}
					
					Ext.getCmp('GeoTracksDistance').setText('Общая длина: ' + Ext.Number.toFixed(distance/1000, 2)+' км');
					
					if(controller.map.geoObjects.getBounds()!=null){
						controller.setBounds(controller.map.geoObjects.getBounds());
					}
				}
				
				controller.mainContainer.setLoading(false);
			}
		);
	},
	
	refreshMapData: function(ddate, agent, agentId){
		var controller = this,
			distanceText = Ext.getCmp('GeoTracksDistance');
		
		controller.trackLines.removeAll();
		controller.terminalCollection.removeAll();
		controller.placeunloadCollection.removeAll();
		controller.trackPointsCollection.removeAll();
		controller.okPointsCollection.removeAll();
		distanceText.setText('');
		
		if(ddate!=null && ddate!="" && agentId>0){
			var agentName = agent.get('position_name');			
			controller.loadDetail(ddate, agentId);
			if(agentName=='Техник АСО'){
				controller.loadTerminals(ddate, agentId);
			}
			if(agentName=='Экспедитор' || agentName=='Водитель'){
				controller.loadPlaceunloads(ddate, agentId);
			}
		}
	},
	
	loadGeotrack: function(){
		var controller=this,
			ddate = Ext.getCmp('filterGeotrackDdate').getValue(),
			agent = Ext.getCmp('GeoTrackAgentsTable').getSelectionModel().getSelection()[0];
		
		controller.refreshMapData(ddate, agent, (agent!=null)?agent.get('id'):null);
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
	
	loadPositions: function(records){
		var controller = this,
			positionsData=[{id: -1, name: 'ВСЕ'}],
			positions={},
			positionId,
			filterGeotrackPosition = Ext.getCmp('filterGeotrackPosition'),
			selectedPosition = filterGeotrackPosition.getValue();
		
		for(var i=0; i<records.length; i++){
			positionId = records[i].get('position_id');
			if(!positions[positionId]){
				positions[positionId] = positionId;
				positionsData.push({
					id: records[i].get('position_id'),
					name: records[i].get('position_name')
				});
			}
		}
		controller.positionsStore.loadData(positionsData);
		selectedPosition = (selectedPosition) ? selectedPosition :-1;
		filterGeotrackPosition.select(selectedPosition);
	},

	filterMaster: function(){
		var controller = this;
		
		controller.mainContainer.setLoading(true);
		
		controller.masterStore.proxy.extraParams = {
			ddate: Ext.getCmp('filterGeotrackDdate').getValue()
		};
		
		controller.masterStore.load(
			function(records, operation, success){
				if(success!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при получении списка агентов");
				}
				if(records!=null){
					controller.loadPositions(records);
				}
				controller.mainContainer.setLoading(false);
			}
		);
	},
	
	showPointByTime: function(date){
		var controller = this,
			minTime, minId, minTrackId, currentTime;
			
		controller.detailStore.each(
			function(r){
				for(var i=0; i<r.pointsArray.length; i++){
					currentTime = Math.abs(r.pointsArray[i].ts.getTime() - date.getTime());
					if(minTime==null || currentTime <= minTime){
						minTime = currentTime;
						minTrackId = r.get('id');
						minId = i;
					}
				}
				return true;
			}
		);
		
		controller.trackPointsCollection.each(
			function(trackPoints){
				var trackId = trackPoints.properties.get('id');
				trackPoints.each(
					function(trackPoint){
						if(trackId==minTrackId && trackPoint.properties.get('id')==minId){
							trackPoint.balloon.open();
						} else {
							trackPoint.balloon.close();
						}
					}
				);
			}
		);
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.Geotrack.Container');
		
		controller.control({
			'#GeoTracksTsFinder': {
				change: function(field, newValue, oldValue, eOpts){
					if(newValue instanceof Date){
						var current = Ext.getCmp('filterGeotrackDdate').getValue();
						current.setHours(newValue.getHours());
						current.setMinutes(newValue.getMinutes());
						console.log(Ext.Date.format(current, 'Y-m-d H:i:s'));
						controller.showPointByTime(current);
					}
				}
			},
			'#GeoTracksTs': {
				toggle: function(button, pressed, eOpts){
					controller.trackPointsCollection.each(function(trackPoints){
						trackPoints.options.set("visible", pressed);
					});
				}
			},
			'#refreshGeoTrackAgents': {
				click: controller.filterMaster
			},
			'#filterGeotrackPosition': {
				select: function(combo, records, eOpts){
					if(records!=null && records[0]!=null){
						var posId = records[0].get('id');
						controller.masterStore.clearFilter();
						if(posId!=-1){
							controller.masterStore.filter('position_id', posId);
						}
					}
				}
			},
			'#refreshGeoTracks': {
				click: controller.loadGeotrack
			},
			'#GeoTrackAgentsTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('GeoTracksTable').setDisabled(selected[0]==null);
					controller.loadGeotrack();
				}
			},
			'#GeoTracksTable': {
				selectionchange: function(sm, selected, eOpts){
					var id=(selected[0]!=null)?selected[0].get('id'):null;
					controller.trackLines.each(
						function(o){
							if(o.properties.get('id')==id){
								o.options.set('strokeColor', '0000FF');
								o.options.set('strokeWidth', '4');
								o.options.set('opacity', '0.5');
								controller.setBounds(o.geometry.getBounds());
								ymaps.getZoomRange('yandex#map', controller.map.getCenter()).then(
									function(zoomRange){
										var currentZoom=controller.map.getZoom();
										if(currentZoom>zoomRange[1]){
											controller.map.setZoom(coords, zoomRange[1]);
										}
									}
								);
								o.balloon.open(o.geometry.get(0));
							} else {
								o.options.set('strokeColor', '555555');
								o.options.set('strokeWidth', '2');
								o.options.set('opacity', '0.4');
								o.balloon.close();
							}
						}
					);
				}
			},
			'#filterGeotrackDdate': {
				change: function(field, newValue, oldValue, eOpts){
					if(newValue instanceof Date){
						controller.filterMaster();
					}
				}
			},
			"#geotrackMap": {
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
			controller.map = new ymaps.Map("geotrackMap",
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
			
			controller.trackLines = new ymaps.GeoObjectCollection(
				{},
				{
					balloonContentLayout: ymaps.templateLayoutFactory.createClass(
						'<h3>$[properties.num]</h3>' +
						'<p>Начало: $[properties.start_time]</p>' +
						'<p>Конец: $[properties.finish_time]</p>'
					)
				}
			);
			controller.trackPointsCollection = new ymaps.GeoObjectCollection();
			
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
			
			controller.terminalCollection = new ymaps.GeoObjectCollection(
				{},
				{
					iconImageHref: '/images/terminal.png',
					iconImageSize: [19, 26],
					balloonContentLayout: ymaps.templateLayoutFactory.createClass(
						'<p>Код: $[properties.code]</p>' +
						'<p>TerminalID: $[properties.terminalid]</p>'
					)
				}
			);
			
			controller.okPointsCollection = new ymaps.GeoObjectCollection(
				{},
				{
					iconImageHref: '/images/ok.png',
					iconImageSize: [19, 26],
					balloonContentLayout: ymaps.templateLayoutFactory.createClass(
						'<p>Код: $[properties.code]</p>' +
						'<p>TerminalID: $[properties.terminalid]</p>' +
						'<p>Время: $[properties.cts_ok]</p>' +
						'<p>$[properties.ok_distance] м до терминала</p>'
					)
				}
			);
			
			controller.placeunloadCollection = new ymaps.GeoObjectCollection(
				{},
				{
					iconImageHref: '/images/shop_small.png',
					iconImageSize: [10, 14],
					iconImageOffset: [-5, -7],
					balloonContentLayout: ymaps.templateLayoutFactory.createClass(
						'<p>Наименование: $[properties.name]</p>' +
						'<p>Адрес: $[properties.address]</p>'
					)
				}
			);
			
			controller.map.geoObjects.add(controller.trackLines);
			controller.map.geoObjects.add(controller.trackPointsCollection);
			controller.map.geoObjects.add(controller.terminalCollection);
			controller.map.geoObjects.add(controller.placeunloadCollection);
			controller.map.geoObjects.add(controller.okPointsCollection);
			
			controller.mainContainer.setLoading(false);
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore = Ext.getCmp('GeoTrackAgentsTable').getStore();
		controller.detailStore = Ext.getCmp('GeoTracksTable').getStore();
		controller.positionsStore = Ext.getCmp('filterGeotrackPosition').getStore();
		controller.terminalsStore = controller.getGeotrackTerminalsStore();
		controller.placeunloadsStore = controller.getGeotrackPlaceunloadsStore();
	},
	
	loadDictionaries: function(){
		var controller = this,
			ddate = Ext.get('ddate').getValue();
			
		if(ddate==null || ddate==""){
			ddate = Ext.Date.format(new Date(), 'Y.m.d');
		}
		
		controller.mainContainer.setLoading(true);
		controller.masterStore.proxy.extraParams = {
			ddate: ddate
		};
		controller.masterStore.load(
			function(records, operation, success){
				if(success!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при получении списка агентов");
				} else {
					if(controller.map!=null){
						controller.initPageData();
					}
				}
				if(records!=null){
					controller.loadPositions(records);
				}
				controller.mainContainer.setLoading(false);
			}
		);
	},
	
	initPageData: function(){
		var controller=this,
			ddate = Ext.get('ddate').getValue(),
			agent = parseInt(Ext.get('agent_id').getValue()),
			ddateFilter = Ext.getCmp('filterGeotrackDdate'),
			sm = Ext.getCmp('GeoTrackAgentsTable').getSelectionModel();
		
		if(ddate!=null && ddate!=""){
			ddateFilter.setValue(ddate);
		}
		if(agent>0){
			sm.select(controller.masterStore.getById(agent));
		}
			
		controller.refreshMapData(ddate, agent);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initMap();
		
		controller.initStores();
		
		controller.loadDictionaries();
	}
});