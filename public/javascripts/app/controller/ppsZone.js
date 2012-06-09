Ext.define('app.controller.ppsZone', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.valueModel',
		'app.model.ppsZone.zoneModel',
		'app.model.ppsZone.terminalModel'],
    init: function() {
	
		function changeTerminal(view, records){
			var rec=records[0];
			if(rec!=null){
				map.setCenter(new YMaps.GeoPoint(rec.get("longitude"), rec.get("latitude")), 100);
			}
		}
	
		var mainContainer=Ext.create('Ext.container.Container', {
			layout: {
				type: 'anchor'
			},
			renderTo: Ext.get('tst'),
			border: 1,
			style: {borderColor:'#000000', borderStyle:'solid', borderWidth:'1px'},
			defaults: {
				labelWidth: 80,
				style: {
					padding: '10px'
				}
			}
		});
		
		var filterContainer=Ext.create('Ext.container.Container', {
			layout: {
				type: 'hbox'
			},
			border: 1,
			style: {borderColor:'#000000', borderStyle:'solid', borderWidth:'1px'},
			defaults: {
				labelWidth: 80,
				style: {
					padding: '10px'
				}
			}
		});
		
		var subdealersStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'ajax',
				url : '/pps_zone/get_subdealers',
				reader: {
					type: 'json'
				}
			}
		});
		
		var zoneTypesStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'ajax',
				url : '/pps_zone/get_zone_types',
				reader: {
					type: 'json'
				}
			}
		});
		
		var branchesStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			autoLoad: true,
			proxy: {
				type: 'ajax',
				url : '/pps_zone/get_branches',
				reader: {
					type: 'json'
				}
			}
		});
		
		var zoneTypesCombo=Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Тип зоны',
			store: zoneTypesStore,
			displayField: 'name',
			valueField: 'id',
			allowBlank: false
		});
		
		var subdealersCombo=Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Субдилер',
			store: subdealersStore,
			displayField: 'name',
			valueField: 'id',
			allowBlank: false
		});

		var zonesStore = Ext.create('Ext.data.Store', {
			model: 'app.model.ppsZone.zoneModel',
			proxy: {
				type: 'rest',
				url: '/pps_zone/zones',
				reader: {
					type: 'json'
				},
				writer: {
					type: 'json'
				}
			}
		});
		
		var terminalsStore = Ext.create('Ext.data.Store', {
			model: 'app.model.ppsZone.terminalModel',
			proxy: {
				type: 'rest',
				url : '/pps_zone/terminals',
				reader: {
					type: 'json'
				},
				writer: {
					type: 'json'
				}
			}
		});
		
		function createZoneTerminalStore(){
			return Ext.create('Ext.data.Store', {
			model: 'app.model.ppsZone.terminalModel',
			autoDestroy: false});
		}
		
		var inZoneTerminalsStore = createZoneTerminalStore();
		var outZoneTerminalsStore = createZoneTerminalStore();
		
		var zoneGridId = Ext.id();
		
		var cellEditingZones = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		})
		
		var zonesPanel=Ext.create('Ext.grid.Panel', {
			id: zoneGridId,
			title: 'Зоны терминалов',
			store: zonesStore,
			columns: [
				{
					header: 'Идентификатор',
					dataIndex: 'id',
					hidden: true
				},
				{
					header: 'Наименование',
					dataIndex: 'name',
					field: {
						allowBlank: false
					}
				},
				{
					header: 'Частота',
					dataIndex: 'visit_freq',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'Статус',
					dataIndex: 'status',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'Граница #',
					dataIndex: 'bound_notes',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'Граница $',
					dataIndex: 'bound_summ',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'Субдилер',
					dataIndex: 'subdealerid',
					renderer: function(value){
						var matching = subdealersStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: subdealersStore,
						displayField: 'name',
						valueField: 'id',
						allowBlank: false
					})
				},
				{
					header: 'Тип зоны (техники или инкассаторы)',
					dataIndex: 'spv_id',
					renderer: function(value){
						var matching = zoneTypesStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: zoneTypesStore,
						displayField: 'name',
						valueField: 'id',
						allowBlank: false
					})
				},
				{
					header: 'Отделение банка',
					dataIndex: 'branch',
					renderer: function(value){
						var matching = branchesStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: branchesStore,
						displayField: 'name',
						valueField: 'id',
						allowBlank: false
					})
				}
			],
			selModel: {
				selType: 'rowmodel'
			},
			plugins: [cellEditingZones],
			height: 200,
			tbar: [{
				text: 'Добавить зону',
				handler : function() {
					cellEditingZones.cancelEdit();
					
					var r = Ext.ModelManager.create({
						name: 'Введите наименование зоны'
					}, 'app.model.ppsZone.zoneModel');

					zonesStore.insert(0, r);
					cellEditingZones.startEdit();
				}
			}, {
				itemId: 'removeZone',
				text: 'Удалить зону',
				handler: function() {
					var sm = zonesPanel.getSelectionModel();
					cellEditingZones.cancelEdit();
					zonesStore.remove(sm.getSelection());
					if (zonesStore.getCount() > 0) {
						sm.select(0);
					}
				},
				disabled: true
			}],
			bbar: [{
				itemId: 'saveZone',
				text: 'Сохранить зону',
				handler : function() {
					var selected=zonesPanel.getSelectionModel().getSelection()[0].data.id;
				
					zonesStore.sync();
					zonesStore.load(function(records, operation, success){
						zonesPanel.getSelectionModel().select(zonesStore.getById(selected));
					});
				},
				disabled: true
			}],
			listeners: {
				'selectionchange': function(view, records) {
					var disabled=!records.length;
					zonesPanel.down('#removeZone').setDisabled(disabled);
					zonesPanel.down('#saveZone').setDisabled(disabled);
					
					saveZonePointsButton.setDisabled(disabled);
				}
			}
		});
		
		var terminalColumns=[
				{
					header: 'Идентификатор',
					dataIndex: 'id',
					hidden: true},
				{
					header: 'Наименование',
					dataIndex: 'name',
					field: {
						allowBlank: false
					}
				},
				{
					header: 'мо #',
					dataIndex: 'avg_notes',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'ско #',
					dataIndex: 'stdev_notes',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'Граница #',
					dataIndex: 'opt_bound',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'Граница (расчет) #',
					dataIndex: 'bound_notes',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'мо $',
					dataIndex: 'avg_summ',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'ско $',
					dataIndex: 'stdev_summ',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'граница $',
					dataIndex: 'opt_bound_summ',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'Граница (расчет) $',
					dataIndex: 'bound_summ',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					xtype:'actioncolumn',
					width:50,
					items: [{
						getClass: function(v, meta, rec) {
							return (rec.get('has_zone_bind'))?'del-col':'add-col';
						},
						handler: function(grid, rowIndex, colIndex) {
							var val=grid.store.getAt(rowIndex).get("has_zone_bind");
							grid.store.getAt(rowIndex).set("has_zone_bind", !val);
						}
					}]
				},
				{
					xtype:'actioncolumn',
					header : 'Обязательная',
						items: [{
						getClass: function(v, meta, rec) {
							return (rec.get('required'))?'checked-col':'unchecked-col';
						},
						handler: function(grid, rowIndex, colIndex) {
							var val=grid.store.getAt(rowIndex).get("required");
							grid.store.getAt(rowIndex).set("required", 1 - val);
						}
					}]
				},				
				{
					header: 'Зоны',
					dataIndex: 'zone_names',
					disabled: true
				},
				{
					header: 'Система',
					dataIndex: 'src_system_name',
					disabled: true
				}
			];
			
		
		var inZoneTerminalGridId = Ext.id();
		
		var inZoneTerminalsPanel=Ext.create('Ext.grid.Panel', {
			id: inZoneTerminalGridId,
			columns: terminalColumns,
			store: inZoneTerminalsStore,
			selModel: {
				selType: 'rowmodel'
			},
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1
			})],
			height: 200,
			listeners: {
				'selectionchange': changeTerminal
			}
		});
		
		var outZoneTerminalGridId = Ext.id();
		
		var outZoneTerminalsPanel=Ext.create('Ext.grid.Panel', {
			id: outZoneTerminalGridId,
			columns: terminalColumns,
			store: outZoneTerminalsStore,
			selModel: {
				selType: 'rowmodel'
			},
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1
			})],
			height: 200,
			listeners: {
				'selectionchange': changeTerminal
			}
		});
		
		var terminalTabs = Ext.create('Ext.tab.Panel', {
			activeTab: 0,
			height: 270,
			plain: true,
			defaults :{
				autoScroll: true,
				bodyPadding: 10
			},
			items: [{
					title: 'Терминалы в зоне',
					id: 'inZoneTerminals',
					items:[inZoneTerminalsPanel]
				},{
					title: 'Терминалы вне зоны',
					id: 'outZoneTerminals',
					items:[outZoneTerminalsPanel]
				}
			],
			listeners: {
				'tabchange' : function(tabPanel, newCard, oldCard, options){
					newCard.doLayout();
				}
			},
			bbar: [
				{
					text    : 'Сохранить терминалы',
					handler : function() {
						terminalTabs.setLoading(true);
						terminalsStore.sync();
						var rec = zonesPanel.getSelectionModel().getSelection()[0].data;
						refreshTerminals(rec.points, rec.id);
						terminalTabs.setLoading(false);
					},
					itemId	: 'saveTerminals'
				}
			]
		});
		
		Ext.define('ZonePoints', {
			extend: 'Ext.data.Model',
			fields: [
				{name: 'id'		, type: 'int'},
				{name: 'points'	, type: 'string'},
				{name: 'points_str'	, type: 'string'}
			],
			proxy: {
				type: 'rest',
				url : '/pps_zone/save_zone_points'
			}
		});
		
		var saveZonePointsButton=Ext.create('Ext.Button', {
			text    : 'Сохранить границы зоны',
			itemId	: 'saveZonePoints',
			disabled: true
		});
		
		
		var Base64 = new function () {
			var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";

			this.encode4bytes = function (x) {
				var chr = [];
				for (var i = 0; i < 4; i++) {
					chr[i] = x & 0x000000ff;
					x = x >> 8;
				}
				return chr;
			}

			this.encode = function (input) {
				var output = "",
					chr1, chr2, chr3, enc1, enc2, enc3, enc4,
					i = 0,
					inputIsString = typeof input == "string";

				while (i < input.length) {
					chr1 = input[i++];
					chr2 = input[i++];
					chr3 = input[i++];
					
					enc1 = chr1 >> 2
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
					enc4 = chr3 & 63;
					
					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}      

					output +=
						_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
						_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
						
				}

				return output;
			}
		};
		
		// Кодирование точек ломанной
		function encodePoints (points) {
			var array = [],                     // Временный массив для точек
				prev = new YMaps.Point(0,0),    // Предыдущая точка
				coef = 1000000;                 // Коэффициент

			// Обработка точек
			for (var i = 0, geoVector, currentPoint; i < points.length; i++) {
				currentPoint = points[i].copy();

				// Нахождение смещение относительно предыдущей точки
				geoVector = currentPoint.diff(prev).neg();

				// Умножение каждой координаты точки на коэффициент и кодирование
				array = array.concat(Base64.encode4bytes(geoVector.getX() * coef), Base64.encode4bytes(geoVector.getY() * coef));
				prev = currentPoint;
			}

			// Весь массив кодируется в Base64
			return Base64.encode(array);
		};
		
		function changeZonePoints(zoneId, polygon, pointsGroup){
			var gp, pm, terminal;
			var currentPoints=polygon.getPoints()
			pointsGroup.removeAll();
			
			terminalsStore.each(
				function(record){
					gp = new YMaps.GeoPoint(record.get('longitude'), record.get('latitude'));
					pm = new YMaps.Placemark(gp,
						{style: "default#bankIcon", draggable: false,
						balloonOptions: {
							maxWidth: 100,
							mapAutoPan: 0
						}
					});
					
					pm.description = record.get('name');
					pointsGroup.add(pm);
					
					return true;
				}
			);
		}
		
		function changeZoneMap(zonePoints, zoneId){
			map.removeAllOverlays();
			drawZones();
			
			var polygon;
			
			if(zonePoints!=null){
				polygon = YMaps.Polygon.fromEncodedPoints(
					zonePoints,
					"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
					{style: "polygon#Example2"});
					
				map.addOverlay(polygon);
				
				YMaps.Events.observe(map, map.Events.Click, function (map, mEvent) {
					polygon.addPoint(mEvent.getGeoPoint());
				});
				YMaps.Events.observe(polygon, polygon.Events.PositionChange, function () {
					changeZonePoints(zoneId, polygon, pointsGroup);
				});
				
				saveZonePointsButton.handler=function(button, e, options) {
					
					var selectedZoneId=zonesPanel.getSelectionModel().getSelection()[0].get('id');
					var points=encodePoints(polygon.getPoints());
					
					var pointsStr="";
					var currentPoints=polygon.getPoints();
					for(var i=0; i<currentPoints.length; i++){
						pointsStr+=i+", "+currentPoints[i].getX()+", "+currentPoints[i].getY()+";";
					}
					
					var zonePoint=Ext.ModelManager.create({
						id : selectedZoneId,
						points: points,
						points_str: pointsStr
					}, 'ZonePoints');

					zonePoint.save();
					zonesStore.getById(selectedZoneId).set('points', points);
					zonesStore.load(function(records, operation, success){
						zonesPanel.getSelectionModel().select(zonesStore.getById(selectedZoneId));
					});
				};
				
				var pointsGroup = new YMaps.OverlayGroup();
				changeZonePoints(zoneId, polygon, pointsGroup);
				map.addOverlay(pointsGroup);
				
			} else {
				polygon = new YMaps.Polygon( null, {style: "polygon#Example2"} );
			}
			
			if (polygon.getNumPoints() > 0) {
				// Создаем область показа по группе точек
				bounds = new YMaps.GeoCollectionBounds(polygon.getPoints());
				map.setBounds(bounds);
				polygon.startEditing();
			}
			else {
				map.setCenter(new YMaps.GeoPoint(37.64, 55.76), 10);
			}
		};
		
		function changeZones(zoneTypeId, subdealerId){
			zonesPanel.setDisabled(true);
			zonesStore.proxy.extraParams = {
				zoneType: zoneTypeId,
				subdealer: subdealerId};
			zonesStore.load(function(records, operation, success){
				if(success){
					changeZoneMap(null, null);
					zonesPanel.setDisabled(false);
				}
			});
		};
		
		subdealersCombo.addListener(
			'change',
			function(field, newValue, oldValue, options){
				changeZones(zoneTypesCombo.value, newValue);
			});
			
		zoneTypesCombo.addListener(
			'change',
			function(field, newValue, oldValue, options){
				changeZones(newValue, subdealersCombo.value);
			});
		
		function drawZones(){
			var polygons=new Array;
			var currentRow;
			for (var i = 0; i < zonesStore.getCount(); i++) {
				currentRow=zonesStore.getAt(i);
				
				if (currentRow.get('points') != null) {
					polygons[i] = YMaps.Polygon.fromEncodedPoints(
						currentRow.get('points'),
						"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
						{style: "polygon#Example1"});
				}
				else
				{
					polygons[i] = new YMaps.Polygon( null, {style: "polygon#Example1"} );
				}
				polygons[i].name = currentRow.get('name');
				map.addOverlay(polygons[i]);
			};
		};
		
		function refreshTerminals(points, zoneId){
			var polygon = YMaps.Polygon.fromEncodedPoints(
				points,
				"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
				{style: "polygon#Example1"});
				
			var bounds = new YMaps.GeoCollectionBounds(polygon.getPoints());
			terminalsStore.proxy.extraParams={
				subdealer: subdealersCombo.value,
				zone_id: zoneId,
				visit_freq: zonesStore.getById(zoneId).get("visit_freq")
			};
			terminalsStore.load(function(records, operation, success){
				if(success){
					var inZone=[], outZone=[];
					changeZoneMap(points, zoneId);
					
					//разбираем терминалы на терминалы в зоне и на терминалы зоны вне границ зоны
					terminalsStore.each(
						function(record){
							if(record.get('has_geo_zone_bind')){
								inZone.push(record);
							} else {
								outZone.push(record);
							}
							return true;
						}
					);
					
					inZoneTerminalsStore.loadData(inZone, false);
					outZoneTerminalsStore.loadData(outZone, false);
					
					terminalTabs.setDisabled(false);
				}
			});
		};
		
		zonesPanel.addListener(
			'beforeselect',
			function(view, node, selections, options){
				var data=(node!=null)?node.data:null;
				terminalTabs.setDisabled(true);
				refreshTerminals(data.points, data.id);
			});
			
		filterContainer.add(zoneTypesCombo);
		filterContainer.add(subdealersCombo);
		mainContainer.add(filterContainer);
		
		mainContainer.add(zonesPanel);
		mainContainer.add(terminalTabs);
		mainContainer.add(saveZonePointsButton);
		
		zonesPanel.setDisabled(true);
		terminalTabs.setDisabled(true);
    }
});