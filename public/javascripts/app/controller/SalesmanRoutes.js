Ext.define('app.controller.SalesmanRoutes', {
	extend : 'Ext.app.Controller',

	stores : ['SalesmanRoutes.PalmUnits'],

	models : ['valueModel', 'SalesmanRoutes.GeoDataModel'],

	views : ['SalesmanRoutes.Container'],

	mainContainer : null,
	map : null,

	geoDataStore : null,
	palmUnitsStore : null,

	geoArraySalesman : null,
	geoPointArrays : [],

	pointBalloonPattern : null,

	showServerError : function(responseText) {
		Ext.Msg.alert('Ошибка', responseText);
	},
	loadGeoData : function(palmUnitId, ddate) {
		var controller = this;

		controller.geoDataStore.proxy.extraParams = {
			palm_unit_id : palmUnitId,
			ddate : ddate
		};

		controller.geoDataStore.load();
	},
	getRouteColumnClass : function(v, meta, rec) {
		var flag = rec.showRoute;
		return (flag === true) ? 'enabled-col' : (flag === false ? 'disabled-col' : 'empty-col');
	},
	init : function() {
		var controller = this;

		controller.mainContainer = Ext.create('app.view.SalesmanRoutes.Container');

		this.control({
			'#refreshInfo': {
				click: function(){
					controller.loadGeoData(Ext.getCmp('palmUnitCombo').getValue(), Ext.getCmp('ddate').getValue());
				}
			},
			'#palmUnitCombo' : {
				change : function(field, newValue, oldValue, options) {
					controller.loadGeoData(newValue, Ext.getCmp('ddate').getValue());
					return true;
				}
			},
			'#ddate' : {
				change : function(field, newValue, oldValue, options) {
					controller.loadGeoData(Ext.getCmp('palmUnitCombo').getValue(), newValue);
					return true;
				}
			},
			'#dataTable' : {
				checkchange : function(node, checked, eOpts) {
					if(node.get("level") != 2) {
						if(node.get("level")==1) {
							node.showRoute = checked;
							controller.geoArraySalesman.get(node.get("row_num")).options.set("visible", node.showRoute);
						}
						node.eachChild(function(child) {
							child.set("checked", checked);
							if(child.get("level") == 2) {
								controller.geoPointArrays[child.parentNode.get("row_num")].get(child.point.row_num).options.set("visible", checked);
							}
							Ext.getCmp('dataTable').fireEvent("checkchange", child, checked);
							return true;
						});
					} else {
						controller.geoPointArrays[node.parentNode.get("row_num")].get(node.get("row_num")).options.set("visible", checked);
					}
				},
				cellclick: function(table, td, cellIndex, record, tr, rowIndex, e, eOpts){
					//ХАРКОД НОМЕРА КОЛОНКИ!!! надо что-то делать только при клике на колонку с информацией
					if(cellIndex==0){
						if(record.get("level")==2){
							var point=controller.geoPointArrays[record.parentNode.get("row_num")].get(record.point.row_num);
							controller.map.panTo(point.geometry.getCoordinates());
							point.balloon.open();
						}
						if(record.get("level")==1){
							var route=controller.geoArraySalesman.get(record.get("row_num")),
								bounds = route.geometry.getBounds();
							if(bounds != null){
								if(bounds[0][0]!=bounds[1][0] && bounds[0][1]!=bounds[1][1]){
									controller.map.setBounds(bounds);
								} else {
									controller.map.panTo(bounds[0]);
								}
								route.balloon.open();
							}
						}
					}
					return true;
				} 
			}
		});
	},
	onLaunch : function() {
		var controller = this, table = Ext.getCmp('dataTable');

		controller.palmUnitsStore = controller.getSalesmanRoutesPalmUnitsStore();
		controller.geoDataStore = table.getStore();
		controller.geoDataStore.addListener({
			load : function(treeStore, node, records, successful, eOpts) {
				if(successful == true) {
					for(var i = 0; i < controller.geoPointArrays.length; i++) {
						controller.geoPointArrays[i].removeAll();
						controller.map.geoObjects.remove(controller.geoPointArrays[i]);
					}
					controller.geoPointArrays = [];

					controller.geoArraySalesman.removeAll();
					controller.map.geoObjects.remove(controller.geoArraySalesman);
					
					node.firstChild.eachChild(function(salesmanNode) {
						var routePoints = [];
						//создаем массив для торговых точек точек
						controller.geoPointArrays[salesmanNode.get("row_num")] = new ymaps.GeoObjectArray({}, {
							preset : 'twirl#' + salesmanNode.colorStr + 'DotIcon',
							balloonContentLayout : controller.pointBalloonTemplate
						});
						//заполняем массив точками
						salesmanNode.eachChild(function(pointNode) {
							controller.geoPointArrays[salesmanNode.get("row_num")].add(new ymaps.Placemark([pointNode.point.latitude, pointNode.point.longitude], {
								color : salesmanNode.colorStr,
								name : pointNode.get("name"),
								address : pointNode.get("address"),
								order_cnt : pointNode.get("order_cnt"),
								order_summ : pointNode.get("order_summ"),
								ts : pointNode.point.ts
							}), pointNode.point.row_num);

							return true;
						});
						controller.map.geoObjects.add(controller.geoPointArrays[salesmanNode.get("row_num")]);
						//создаем массив координат точек маршрута
						for(var i = 0; i < salesmanNode.route.length; i++) {
							routePoints[salesmanNode.route[i].row_num] = [salesmanNode.route[i].latitude, salesmanNode.route[i].longitude];
						}
						controller.geoArraySalesman.add(new ymaps.Polyline(routePoints, {
							color : salesmanNode.colorStr,
							name : salesmanNode.get("name"),
							start_ts : salesmanNode.start_ts,
							end_ts : salesmanNode.end_ts
						}, {
							strokeWidth : 3,
							opacity : 5,
							strokeColor : salesmanNode.colorHex,
							balloonContentLayout : controller.geoArrayTemplate
						}), salesmanNode.get("row_num"));

						return true;
					});
					controller.map.geoObjects.add(controller.geoArraySalesman);
					
					if(controller.map.geoObjects.getBounds()!=null){
						controller.map.setBounds(controller.map.geoObjects.getBounds());
					}
				}
			}
		});

		Ext.getCmp('palmUnitCombo').bindStore(controller.palmUnitsStore);

		ymaps.ready(function() {
			// Создание экземпляра карты и его привязка к созданному контейнеру
			controller.map = new ymaps.Map("salesman_routes_map", {
				center : [54.7, 36.9],
				// Центр карты
				zoom : 10,
				// Тип карты
				type : "yandex#map",
				behaviors : ["default", "scrollZoom"]
			});

			// Добавление элементов управления
			controller.map.controls.add("zoomControl");
			controller.map.controls.add("typeSelector");
			controller.map.controls.add("mapTools");

			controller.geoArraySalesman = new ymaps.GeoObjectArray();

			controller.map.geoObjects.add(controller.geoArraySalesman);

			controller.pointBalloonTemplate = ymaps.templateLayoutFactory.createClass('<h3 style="color: $[properties.color];">$[properties.name]</h3>' + '<p>$[properties.address]</p>' + '<p>Заказов: $[properties.order_cnt]</p>' + '<p>Сумма: $[properties.order_summ]</p>');

			controller.geoArrayTemplate = ymaps.templateLayoutFactory.createClass('<h3 style="color: $[properties.color];">$[properties.name]</h3>' + '<p>Начало: $[properties.start_ts], конец: $[properties.end_ts]</p>');
		});
	}
});
