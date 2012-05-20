Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn'
]);
Ext.define('app.controller.simka', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.valueModel',
		'app.model.valueStrModel',
		'app.model.simka.simkaModel'],
    init: function() {
	
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
		
		Ext.Ajax.request.failure = showServerError;
		
		function loadSimka(){
		    simkaContainer.setDisabled(true);
		    mainContainer.setLoading(true);
		
		    var ddateb = new Date(filterPanel.down('#startDate').getValue());
		    var ddatee = new Date(filterPanel.down('#endDate').getValue());
		    simkaStore.proxy.extraParams={
			ddateb: Ext.Date.format(ddateb, 'Y-m-d'),
			ddatee: Ext.Date.format(ddatee, 'Y-m-d')
		    };	
		    simkaStore.load(
			function(records, operation, success){
			    simkaContainer.setDisabled(false);
			    mainContainer.setLoading(false);
			}
		    );
			
		};
		

		
		var simkaStore = Ext.create('Ext.data.Store', {
			model: 'app.model.simka.simkaModel',
			proxy: {
				type: 'rest',
				url : '/sim_place/simka_do',
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
					loadSimka();
				};
				
				return listeners;
			}
		});
		
		var mainContainer=Ext.create('Ext.container.Container', {
			width: 1100,
			layout: {
				type: 'anchor'
			},
			renderTo: Ext.get('simka_js'),
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
		
		
		
		var filterSimka=Ext.create('Ext.Button', {
			text    : 'Фильтр',
			handler : loadSimka
		});
		
		filterPanel.add(filterSimka);
		mainContainer.add(filterPanel);
	
		var cellEditingSimka = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		
		var simkaContainer = Ext.create('Ext.container.Container', {
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
	
		var spId='simkaTable';
		
		var simkaPanel=Ext.create('Ext.grid.Panel', {
			id: spId,
			title: 'Справочник сим-карт',
			store: simkaStore,
			columns: [
				{
					header: 'Идентификатор',
					dataIndex: 'id',
					hidden: true,
					disabled: true
				},
				{
					header: 'msidn',
					dataIndex: 'msidn',
					field: {
						xtype: 'textfield'
					}
				},
				{
					header: 'icc',
					dataIndex: 'icc',
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
					header: 'Безлимит',
					dataIndex: 'unlim',
					field: {
						xtype: 'textfield'
					}
				},
				{
					header: 'Дата безлим',
					dataIndex: 'date_unlim',
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
					header: 'Блок',
					dataIndex: 'isblocked',
					width: 50,
					xtype: 'checkcolumn'
				}
			],
			selModel: {
				selType: 'rowmodel'
			},
			plugins: [cellEditingSimka],
			height: 400,
			tbar: [{
				text: 'Добавить',
				handler : function() {
				    cellEditingSimka.cancelEdit();
					
				    var r = Ext.ModelManager.create({
						ddate	: new Date(Ext.Date.now()),
						isblocked : false
					}, 'app.model.simka.simkaModel');
					simkaStore.insert(0, r);
				}
			}, {
				itemId: 'removeSimka',
				text: 'Удалить',
				handler: function() {
				    var sm = simkaPanel.getSelectionModel();
					cellEditingSimka.cancelEdit();
					simkaStore.remove(sm.getSelection());
					if (simkaStore.getCount() > 0) {
						sm.select(0);
					} else {
						simkaStore.removeAll(true);
					};
				}
			}],
			bbar: [{
				text    : 'Сохранить',
				handler : function() {
				    var selection=simkaPanel.getSelectionModel().getSelection()[0];
				    simkaStore.proxy.extraParams={};
				    simkaStore.sync();
				    if(selection!=null && selection.date!=null){
					simkaPanel.getSelectionModel().select(simkaStore.getById(selection.data.id));
				    }
				}
			}]
		});
		
		simkaContainer.add(simkaPanel);
		mainContainer.add(simkaContainer);
	}
});