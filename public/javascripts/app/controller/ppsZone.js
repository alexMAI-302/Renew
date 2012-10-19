Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn'
]);
Ext.define('app.controller.ppsZone', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.valueModel',
		'app.model.ppsZone.zoneModel',
		'app.model.ppsZone.terminalModel'],
    init: function() {
		var map,
			polygons,
			pointsGroup,
			center=[55.76, 37.64],
			style1 = 
			{
				// - цвет и прозрачность заливки
				fillColor: "ff000055"
			},
			style2 = 
			{
				// - цвет и прозрачность заливки
				fillColor: "ffff0055"
			},
			filterContainer=Ext.create('Ext.container.Container', {
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
			}),
			subdealersStore = Ext.create('Ext.data.Store', {
				model: 'app.model.valueModel',
				proxy: {
					type: 'ajax',
					url : '/util_data/get_subdealers',
					reader: {
						type: 'json'
					}
				}
			}),
			zoneTypesStore = Ext.create('Ext.data.Store', {
				model: 'app.model.valueModel',
				proxy: {
					type: 'ajax',
					url : '/pps_zone/get_zone_types',
					reader: {
						type: 'json'
					}
				}
			}),
			branchesStore = Ext.create('Ext.data.Store', {
				model: 'app.model.valueModel',
				autoLoad: true,
				proxy: {
					type: 'ajax',
					url : '/util_data/get_branches',
					reader: {
						type: 'json'
					}
				}
			}),
			zoneTypesCombo=Ext.create('Ext.form.ComboBox', {
				fieldLabel: 'Тип зоны',
				store: zoneTypesStore,
				displayField: 'name',
				valueField: 'id',
				allowBlank: false
			}),
			subdealersCombo=Ext.create('Ext.form.ComboBox', {
				fieldLabel: 'Субдилер',
				store: subdealersStore,
				displayField: 'name',
				valueField: 'id',
				allowBlank: false
			}),
			zonesStore = Ext.create('Ext.data.Store', {
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
			}),
			terminalsStore = Ext.create('Ext.data.Store', {
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
			}),
			inZoneTerminalsStore = createZoneTerminalStore(),
			outZoneTerminalsStore = createZoneTerminalStore(),
			zoneGridId = Ext.id(),
			cellEditingZones = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1
			}),
			zonesPanel=Ext.create('Ext.grid.Panel', {
				id: zoneGridId,
				store: zonesStore,
				region: 'north',
				title: 'Зоны терминалов',
				split: true,
				height: '33%',
				autoScroll: true,
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
						var r=zonesPanel.getSelectionModel().getSelection()[0],
							selected=r.data.id;
						
						if(!r.get('subdealerid')>0 || !r.get('spv_id')>0){
							Ext.Msg.alert('Ошибка', 'Поля "Тип зоны" и "Субдилер" должны быть заполнены!');
						} else {
							zonesStore.sync();
							zonesStore.load(function(records, operation, success){
								zonesPanel.getSelectionModel().select(zonesStore.getById(selected));
							});
						}
					},
					disabled: true
				}],
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
				listeners: {
					'selectionchange': function(view, records) {
						var disabled=!records.length;
						zonesPanel.down('#removeZone').setDisabled(disabled);
						zonesPanel.down('#saveZone').setDisabled(disabled);
						
						saveZonePointsButton.setDisabled(disabled);
					},
					'beforeselect': function(view, node, selections, options){
						var data=(node!=null)?node.data:null;
						terminalTabs.setDisabled(true);
						refreshTerminals(data.points, data.id);
					}
				}
			}),
			terminalColumns=
			[
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
					dataIndex: 'bound_notes',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'Граница (расчет) #',
					dataIndex: 'opt_bound',
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
					dataIndex: 'bound_summ',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					header: 'Граница (расчет) $',
					dataIndex: 'opt_bound_summ',
					field: {
						xtype: 'numberfield'
					}
				},
				{
					xtype: 'checkcolumn',
					header : 'Обязательная',
					dataIndex: 'required'
				},
				{
					xtype:'actioncolumn',
					width:50,
					items: [{
						getClass: getTerminalClass,
						handler: function(view, rowIndex, colIndex) {
							var currentRecord=view.store.getAt(rowIndex);
							var val=currentRecord.get("has_zone_bind");
							var node=view.getNode(currentRecord);
							
							var img=Ext.fly(Ext.fly(node).down(this.getCellSelector())).down('img');
							
							img.removeCls(getTerminalClass(null, null, currentRecord));
							
							currentRecord.set("has_zone_bind", !val);
							img.addCls(getTerminalClass(null, null, currentRecord));
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
			],
			inZoneTerminalGridId = Ext.id(),
			inZoneTerminalsPanel=Ext.create('Ext.grid.Panel', {
				id: inZoneTerminalGridId,
				columns: terminalColumns,
				store: inZoneTerminalsStore,
				selModel: {
					selType: 'rowmodel'
				},
				plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1
				})],
				listeners: {
					'selectionchange': changeTerminal
				}
			}),
			outZoneTerminalGridId = Ext.id(),
			outZoneTerminalsPanel=Ext.create('Ext.grid.Panel', {
				id: outZoneTerminalGridId,
				columns: terminalColumns,
				store: outZoneTerminalsStore,
				selModel: {
					selType: 'rowmodel'
				},
				plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1
				})],
				listeners: {
					'selectionchange': changeTerminal
				}
			}),
			terminalTabs = Ext.create('Ext.tab.Panel', {
				activeTab: 0,
				plain: true,
				region: 'center',
				split: true,
				autoScroll: true,
				height: '33%',
				defaults: {
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
			}),
			saveZonePointsButton=Ext.create('Ext.Button', {
				text    : 'Сохранить границы зоны',
				itemId	: 'saveZonePoints',
				disabled: true,
				handler	: handler=function(button, e, options) {
					var geometry;
					polygons.each(function(o){
						if(o.selected!=null && o.selected=="selected"){
							geometry=o.geometry;
						}
						return true;
					});
					if(geometry!=null){
						var
							selectedZoneId=zonesPanel.getSelectionModel().getSelection()[0].get('id'),
							points=ymaps.geometry.Polygon.toEncodedCoordinates(geometry),
							pointsStr="",
							currentPoints=geometry.get(0);
						for(var i=0; i<currentPoints.length; i++){
							pointsStr+=i+", "+currentPoints[i][1]+", "+currentPoints[i][0]+";";
						}
						
						var zonePoint=Ext.ModelManager.create({
							id : selectedZoneId,
							points: points,
							points_str: pointsStr
						}, 'ZonePoints');
	
						zonePoint.save({
							callback: function(){
								zonesStore.getById(selectedZoneId).set('points', points);
								zonesStore.load(function(records, operation, success){
									zonesPanel.getSelectionModel().select(zonesStore.getById(selectedZoneId));
								});
							}
						});
					}
				}
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
		
		function changeTerminal(view, records){
			var rec=records[0];
			if(rec!=null){
				map.setCenter([rec.get("latitude"), rec.get("longitude")], 100, {checkZoomRange: true});
			}
		};
		
		function createZoneTerminalStore(){
			return Ext.create('Ext.data.Store', {
			model: 'app.model.ppsZone.terminalModel',
			autoDestroy: false});
		};
		
		function getTerminalClass(v, meta, rec) {
			return (rec.get('has_zone_bind'))?'del-col':'add-col';
		};
		
		function changeZonePoints(){
			pointsGroup.removeAll();
			terminalsStore.each(
				function(record){
					var pm = new ymaps.Placemark(
						[record.get('latitude'), record.get('longitude')],
						{
							draggable: false,
							balloonMaxWidth: 100,
							balloonAutoPan: true,
							balloonContent: record.get('name') 
						},
						{
							preset: "twirl#bankIcon",
						}
					);
					
					pointsGroup.add(pm);
					
					return true;
				}
			);
		}
		
		function changeZoneMap(zonePoints, zoneId){
			var polygon;
			
			//исключаем текущую зону из рисования всех зон
			drawZones(zoneId);
			
			if(zonePoints!=null && zonePoints!=""){
				polygon = new ymaps.Polygon(
						ymaps.geometry.Polygon.fromEncodedCoordinates(zonePoints),
						{balloonContent: zonesStore.getById(zoneId).get('name')},
						style2
					);
				polygon.selected="selected";
				changeZonePoints();
				
				polygons.add(polygon);
				polygon.events.add("geometrychange", function () {
					changeZonePoints();
				});
			} else {
				if(zoneId!=null){
					polygon = new ymaps.Polygon([[center]], null, style1);
				}
			}

			if (polygon!=null && polygon.geometry.get(0).length > 2) {
				map.setBounds(polygon.geometry.getBounds());
				polygon.editor.startEditing();
			}
			else {
				map.setCenter(center, 10);
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
		
		function drawZones(excludeZoneId){
			var currentRow, polygon;
			
			polygons.removeAll();
			for (var i = 0; i < zonesStore.getCount(); i++) {
				currentRow=zonesStore.getAt(i);
				if(currentRow.get('id')!=excludeZoneId){
					polygon = new ymaps.Polygon(
						(currentRow.get('points') != null && currentRow.get('points')!="")?
						ymaps.geometry.Polygon.fromEncodedCoordinates(currentRow.get('points')):
						[[center]],
						{balloonContent: currentRow.get('name')},
						style1
					);
					
					polygons.add(polygon);
				}
			}
		};
		
		function refreshTerminals(points, zoneId){
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
			
		filterContainer.add(zoneTypesCombo);
		filterContainer.add(subdealersCombo);
		
		var mainContainer=Ext.create('Ext.panel.Panel', {
			height: 1000,
			layout: 'border',
			split: true,
			resizable: true,
			items: [{
				region: 'north',
				xtype: 'panel',
				items: [filterContainer]
			},
			{
				region: 'center',
				xtype: 'panel',
				layout: 'border',
				split: true,
				defaults:{
					border: 5
				},
				items: [
					zonesPanel,
					terminalTabs,
					{
						region: 'south',
						xtype: 'panel',
						layout: 'border',
						tbar: [saveZonePointsButton],
						items:[
							{
								region: 'center',
								xtype: 'panel',
								items: {
									html: '<div id="YMapsID"/>'
								},
								height: '100%'
							}
						],
						split: true,
						height: '33%'
					}
				]
			}],
			renderTo: Ext.get('pps_zone_js'),
		});
		
		zonesPanel.setDisabled(true);
		terminalTabs.setDisabled(true);
		
		ymaps.ready(function(){
            // Создание экземпляра карты и его привязка к созданному контейнеру
            map = new ymaps.Map("YMapsID",
            	{
			        // Центр карты
			        center: center,
			        zoom: 10,
			        // Тип карты
			        type: "yandex#map",
			        behaviors: ["default", "scrollZoom"]
			    }
			);
            // Добавление элементов управления
            map.controls.add("zoomControl");
            map.controls.add("typeSelector");
            map.controls.add("mapTools");
            
            polygons = new ymaps.GeoObjectCollection("ZonesPolygons");
			pointsGroup = new ymaps.GeoObjectCollection("TerminalPoints");
            
            map.geoObjects.add(polygons);
            map.geoObjects.add(pointsGroup);
        });
    }
});