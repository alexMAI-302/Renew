Ext.define('app.controller.palmRouteDeviation', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.valueModel',
		'app.model.valueStrModel',
		'app.model.palmRouteDeviation.palmRouteDeviationModel'],
    init: function() {
	
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
		
		Ext.Ajax.request.failure = showServerError;
		
		function loadPalmRouteDeviation(){
			palmRouteDeviationContainer.setDisabled(true);
			mainContainer.setLoading(true);
			
			var ddate = Ext.Date.format(filterPanel.down('#ddate').getValue(), 'Y-m-d');
			var supervisor = supervisorCombo.value;
			var salesman = salesmanCombo.value;
			
			if(supervisor!=null && salesman!=null){
				palmRouteDeviationStore.proxy.extraParams={
					ddate: ddate,
					supervisor: supervisor,
					salesman: salesman
				};
				palmRouteDeviationStore.load(
					function(records, operation, success){
						if(!success) {
							Ext.Msg.alert('Ошибка', operation.error)
						}
					}
				);
			}
			mainContainer.setLoading(false);
			palmRouteDeviationContainer.setDisabled(false);
		};
		
		var supervisorStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueStrModel',
			proxy: {
				type: 'ajax',
				url : '/palm_route_deviation/get_supervisor',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true
		});
		
		var supervisorCombo=Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Супервизор',
			store: supervisorStore,
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 100,
			width: 400,
			listeners: {
				"change": function(field, newValue, oldValue, options){
					salesmanStore.proxy.extraParams={
						ddate : Ext.Date.format(filterPanel.down('#ddate').getValue(), 'Y-m-d'),
						supervisor: supervisorCombo.value
					};
					salesmanStore.load();
				}
			}
			
		});
		
		var salesmanStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueStrModel',
			proxy: {
				type: 'ajax',
				url : '/palm_route_deviation/get_salesman',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true
		});
		
		var salesmanCombo=Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'ТП',
			store: salesmanStore,
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 50,
			width: 200
			
		});
		
		var filterPanel=Ext.create('Ext.form.Panel',{
			layout: {
				type: 'hbox'
			},
			defaults: {
				style: {
					margin: '5px'
				}
			},
			items: [{
				id: 'ddate',
				xtype: 'datefield',
				name: 'ddate',
				fieldLabel: 'Дата',
				format: 'd.m.Y',
				altFormat: 'd/m/Y|d m Y',
				startDay: 1,
				value: Ext.Date.add(new Date(Ext.Date.now()), Ext.Date.DAY, -3),
				width: 200,
				listeners: {
					"change": function(field, newValue, oldValue, options){
						supervisorStore.proxy.extraParams={
							ddate: Ext.Date.format(newValue, 'Y-m-d')
						};
						supervisorStore.load();
					}
				}
			}]
		});
		
		
		
		var filterButton=Ext.create('Ext.Button', {
			text    : 'Фильтр',
			handler : loadPalmRouteDeviation,
			disabled: false
		});
		
		filterPanel.add(supervisorCombo);
		filterPanel.add(salesmanCombo);
		filterPanel.add(filterButton);
		
		var palmRouteDeviationStore = Ext.create('Ext.data.Store', {
			model: 'app.model.palmRouteDeviation.palmRouteDeviationModel',
			proxy: {
				type: 'rest',
				url : '/palm_route_deviation/palm_route_deviation',
				reader: {
					type: 'json'
				},
				writer: {
					type: 'json'
				}
			}
		});
		
		var reasonStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueStrModel',
			proxy: {
				type: 'ajax',
				url : '/palm_route_deviation/get_reasons',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true
		});
		
		var mainContainer=Ext.create('Ext.container.Container', {
			width: 1100,
			layout: {
				type: 'anchor'
			},
			renderTo: Ext.get('palm_route_deviation_js'),
			defaults: {
				style: {
					margin: '10px'
				}
			}
		});
		
		var palmRouteDeviationContainer = Ext.create('Ext.container.Container', {
			width: 1100,
			layout: {
				type: 'anchor'
			},
			defaults: {
				style: {
					margin: '10px'
				}
			},
			margin: '-0px',
			disabled: true
		});
	
		var cellEditingCells = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		
		var palmRouteDeviationPanel=Ext.create('Ext.grid.Panel', {
			id: 'id',
			title: 'Отклонения',
			store: palmRouteDeviationStore,
			columns: [
				{
					header: 'Идентификатор',
					dataIndex: 'id',
					hidden: true,
					disabled: true
				},
				{
					header: 'ТП',
					dataIndex: 'salesman',
					disabled: true,
					width: 150
				},
				{
					header: 'Покупатель',
					dataIndex: 'buyer',
					disabled: true,
					width: 150
				},
				{
					header: 'Адрес',
					dataIndex: 'loadto',
					disabled: true,
					width: 300
				},
				{
					header: 'Тип отклонения',
					dataIndex: 'type',
					disabled: true
				},
				{
					width: 150,
					header: 'Причина',
					dataIndex: 'reason',
					renderer: function(value){
						var matching = reasonStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: reasonStore,
						displayField: 'name',
						valueField: 'id',
						allowBlank: false,
						queryMode: 'local',
						listeners:{
							"focus": function (obj, options){
								obj.expand();
							}
						}
					})
				},
				{
					width: 100,
					header: 'Комментарий',
					dataIndex: 'comments',
					field: {
						xtype: 'textfield'
					}
				}				
			],
			bbar: [{
				text	: 'Сохранить',
				handler : function() {
					palmRouteDeviationStore.proxy.extraParams={};
					palmRouteDeviationStore.sync();
				}
			}],
			selModel: {
				selType: 'rowmodel'
			},
			plugins: [cellEditingCells],
			height: 400
		});
		
		//store       = palmRouteDeviationPanel.getStore();
		//store.load();
		
				
		palmRouteDeviationContainer.add(palmRouteDeviationPanel);
		mainContainer.add(filterPanel);
		mainContainer.add(palmRouteDeviationContainer);
	}
});