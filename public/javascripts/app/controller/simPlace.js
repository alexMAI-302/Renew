Ext.define('app.controller.simPlace', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.valueModel',
		'app.model.valueStrModel',
		'app.model.simPlace.simPlaceModel',
		'app.model.simka.simkaModel'],
    init: function() {
	
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
		
		Ext.Ajax.request.failure = showServerError;
		
		function loadSimPlaces(){
		    simPlacesContainer.setDisabled(true);
		    mainContainer.setLoading(true);
		    var ddateb = new Date(filterPanel.down('#startDate').getValue());
		    var ddatee = new Date(filterPanel.down('#endDate').getValue());
		    simPlacesStore.proxy.extraParams={
			ddateb: Ext.Date.format(ddateb, 'Y-m-d'),
			ddatee: Ext.Date.format(ddatee, 'Y-m-d')
		    };	
		    simPlacesStore.load(
			function(records, operation, success){
			    simPlacesContainer.setDisabled(false);
			    mainContainer.setLoading(false);
			}
		    );			
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

		var simkaStore = Ext.create('Ext.data.Store', {
			model: 'app.model.simka.simkaModel',
			autoLoad: true,
			proxy: {
				type: 'rest',
				url : '/sim_place/get_simka',
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
			margin: '-0px',
			disabled: true
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
					dataIndex: 'simka_id',
					width: 300,
					renderer: function(value, metaData, record){
						var matching=null;
						if(value!=null){
							simkaStore.each(
								function(storeRecord){
									if(storeRecord.get('id') == value){
										matching=storeRecord.get('icc');
									}
									return matching==null;
								});
						}
						return (matching) ? matching : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: simkaStore,
						displayField: 'icc',
						valueField: 'id',
						queryMode: 'local',
						selectOnFocus: true
					})
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
					width: 150,
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
				itemId: 'removeSimPlace',
				text: 'Удалить симку',
				handler: function() {
				    var sm = simPlacesPanel.getSelectionModel();
				    cellEditingSimPlaces.cancelEdit();
				    simPlacesStore.remove(sm.getSelection());
				    if (simPlacesStore.getCount() > 0) {
					sm.select(0);
				    } else {
					simPlacesStore.removeAll(true);
				    };
				}
			}],
			bbar: [{
				text    : 'Сохранить',
				handler : function() {
				    var selection=simPlacesPanel.getSelectionModel().getSelection()[0];
				    simPlacesStore.proxy.extraParams={};
				    simPlacesStore.sync();
				    if(selection!=null && selection.date!=null){
					simPlacesPanel.getSelectionModel().select(simPlacesStore.getById(selection.data.id));
				    }
				}
			}]
		});
		
		simPlacesContainer.add(simPlacesPanel);
		mainContainer.add(simPlacesContainer);
	}
});