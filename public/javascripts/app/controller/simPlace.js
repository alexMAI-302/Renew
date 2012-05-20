Ext.define('app.controller.simPlace', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.valueModel',
		'app.model.valueStrModel',
		'app.model.simPlace.simPlaceModel'],
    init: function() {
	
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
		
		Ext.Ajax.request.failure = showServerError;
		
		function loadSimPlaces(){
			
		    //Ext.Msg.alert('Test', 'Задайте значение для поля "  "');
			
		};
		
		var personStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			autoLoad: true,
			proxy: {
				type: 'rest',
				url : '/sim_place/get_person',
				reader: {
					type: 'json'
				}
			}
		});
		
		var simPlacesStore = Ext.create('Ext.data.Store', {
			model: 'app.model.simPlace.simPlaceModel',
			proxy: {
				type: 'rest',
				url : '/sim_place/sim_places',
				batchUpdateMode: 'complete',
				reader: {
					type: 'json'
				},
				writer: {
					type: 'json'
				}
			},
			getBatchListeners: function() {
				var listeners={};
				
				listeners.complete = function(batch, operation, options){
					loadSimPlaces();
				};
				
				return listeners;
			}
		});
		
		var mainContainer=Ext.create('Ext.container.Container', {
			width: 1100,
			layout: {
				type: 'anchor'
			},
			renderTo: Ext.get('sim_place_js'),
			defaults: {
				style: {
					margin: '10px'
				}
			}
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
				id: 'startDate',
				xtype: 'datefield',
				name: 'startDate',
				fieldLabel: 'Начало периода',
				format: 'd.m.Y',
				altFormat: 'd/m/Y|d m Y',
				startDay: 1,
				value: Ext.Date.add(new Date(Ext.Date.now()), Ext.Date.DAY, -3)
			},{
				id: 'endDate',
				xtype: 'datefield',
				name: 'endDate',
				fieldLabel: 'Конец периода',
				format: 'd.m.Y',
				altFormat: 'd/m/Y|d m Y',
				startDay: 1,
				value: new Date(Ext.Date.now())
			}]
		});
		
		
		
		var filterSimPlaces=Ext.create('Ext.Button', {
			text    : 'Фильтр',
			handler : loadSimPlaces
		});
		
		filterPanel.add(filterSimPlaces);
		mainContainer.add(filterPanel);
	
		var cellEditingSimPlaces = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		
		var simPlacesContainer = Ext.create('Ext.container.Container', {
			width: 1100,
			layout: {
				type: 'anchor'
			},
			defaults: {
				style: {
					margin: '10px'
				}
			},
			margin: '-0px'
		});
	
		var spId='simPlacesTable';
		
		var simPlacesPanel=Ext.create('Ext.grid.Panel', {
			id: spId,
			title: 'Выдача сим-карт',
			store: simPlacesStore,
			columns: [
				{
					header: 'Идентификатор',
					dataIndex: 'id',
					hidden: true,
					disabled: true
				},
				{
					header: 'SIM',
					dataIndex: 'simserial',
					field: {
						xtype: 'textfield'
					}
				},
				{
					header: 'Дата',
					dataIndex: 'ddate',
					width: 100,
					field: {
						xtype: 'datefield',
						format: 'd.m.Y',
						altFormats: 'd/m/Y|d m Y|Y-m-d',
						startDay: 1
					},
					renderer: function(value, metaData, record){
						return (value)?Ext.Date.format(new Date(value), 'd.m.Y'):'';
					}
				},
				{
					header: 'Кому',
					dataIndex: 'person_id',
					renderer: function(value, metaData, record){
						var matching=null;
						if(value!=null){
							personStore.each(
								function(storeRecord){
									if(storeRecord.get('id') == value){
										matching=storeRecord.get('name');
									}
									return matching==null;
								});
						}
						return (matching) ? matching : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: personStore,
						displayField: 'name',
						valueField: 'id',
						queryMode: 'local',
						selectOnFocus: true
					})
				}
			],
			selModel: {
				selType: 'rowmodel'
			},
			plugins: [cellEditingSimPlaces],
			height: 400,
			tbar: [{
				text: 'Добавить симку',
				handler : function() {
				    cellEditingSimPlaces.cancelEdit();
					
				    var r = Ext.ModelManager.create({
						ddate	: new Date(Ext.Date.now())
					}, 'app.model.simPlace.simPlaceModel');
					simPlacesStore.insert(0, r);
				}
			}, {
				itemId: 'removeSellPrice',
				text: 'Удалить симку',
				handler: function() {
					;
				}
			}],
			bbar: [{
				text    : 'Сохранить',
				handler : function() {
				    simPlacesStore.sync();
				}
			}]
		});
		
		simPlacesContainer.add(simPlacesPanel);
		mainContainer.add(simPlacesContainer);
	}
});