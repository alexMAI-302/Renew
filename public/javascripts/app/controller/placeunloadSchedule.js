Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
	'Ext.ux.grid.Printer'
]);
Ext.define('app.controller.placeunloadSchedule', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.placeunloadSchedule.scheduleModel',
		'app.model.valueModel'
	],
    init: function() {
	
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		};
	
		function loadSchedule(){
			schedulePanel.setLoading(true);
			scheduleStore.proxy.extraParams={
				salesman_id: Ext.getCmp('salesmanCombo').getValue(),
				ddate: Ext.getCmp('ddate').getValue(),
			};
			scheduleStore.load();
		};
		
		function selectDayOfWeek(dayIndex, rowIndex){
			var r=schedulePanel.getStore().getAt(rowIndex);
			r.set("day_of_week", dayIndex);
			r.set("monday", false);
			r.set("tuesday", false);
			r.set("wednesday", false);
			r.set("thursday", false);
			r.set("friday", false);
			switch(dayIndex){
				case 1:
					r.set("monday", true);
				break;
				case 2:
					r.set("tuesday", true);
				break;
				case 3:
					r.set("wednesday", true);
				break;
				case 4:
					r.set("thursday", true);
				break;
				case 5:
					r.set("friday", true);
				break;
			}
		};
	
		var salesmansStore = Ext.create('Ext.data.Store', {
				model: 'app.model.valueModel',
				proxy: {
					type: 'rest',
					url : '/placeunload_schedule/get_salesman',
					reader: {
						type: 'json'
					}
				}
			}),
				scheduleStore = Ext.create('Ext.data.Store', {
				model: 'app.model.placeunloadSchedule.scheduleModel',
				proxy: {
					type: 'rest',
					api: {
						update: '/placeunload_schedule/save'
					},
					url : '/placeunload_schedule/get',
					reader: {
						type: 'json'
					}
				},
				listeners: {
					"load": function(store, records, successful, operation, options ){
						if(successful){
							schedulePanel.setLoading(false);
						}
					}
				}
			}),
			filterPanel=Ext.create('Ext.form.Panel',{
				layout: {
					type: 'hbox'
				},
				defaults: {
					style: {
						margin: '5px'
					}
				},
				items: [{
					id: 'salesmanCombo',
					xtype: 'combobox',
					fieldLabel: 'Торговый представитель',
					store: salesmansStore,
					displayField: 'name',
					valueField: 'id',
					allowBlank: false,
					labelWidth: 150,
					width: 400,
					listeners: {
						"select": function(field, value, options ) {
							filterSchedule.setDisabled(value[0].id==null);
							return true;
						},
						"change": function(field, newValue, oldValue, options) {
							filterSchedule.setDisabled(newValue==null);
							return true;
						}
					}
				},{
					id: 'ddate',
					xtype: 'datefield',
					fieldLabel: 'Конец периода',
					format: 'd.m.Y',
					altFormat: 'd/m/Y|d m Y',
					startDay: 1,
					value: new Date(Ext.Date.now())
				}]
			}),
			filterSchedule=Ext.create('Ext.Button', {
				text    : 'Фильтр',
				handler : loadSchedule
			});
		
		filterPanel.add(filterSchedule);
		
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		
		var gridId='scheduleTable';
		var schedulePanel=Ext.create('Ext.grid.Panel', {
			id: gridId,
			title: 'График доставок',
			store: scheduleStore,
			height: '92%',
			region: 'north',
			autoScroll: true,
			columns: [
				{
					width: 300,
					header: 'Торговая точка',
					dataIndex: 'name'
				},
				{
					width: 300,
					header: 'Адрес',
					dataIndex: 'address'
				},
				{
					width: 80,
					header: 'Понедельник',
					align: 'center',
					dataIndex: 'monday',
					xtype: 'checkcolumn',
					listeners: {
						checkchange: function(checkColumn, rowIndex, checked, eOpts){
							selectDayOfWeek(1, rowIndex);
							return true;
						}
					}
				},
				{
					width: 70,
					header: 'Вторник',
					align: 'center',
					dataIndex: 'tuesday',
					xtype: 'checkcolumn',
					listeners: {
						checkchange: function(checkColumn, rowIndex, checked, eOpts){
							selectDayOfWeek(2, rowIndex);
							return true;
						}
					}
				},
				{
					width: 70,
					header: 'Среда',
					align: 'center',
					dataIndex: 'wednesday',
					xtype: 'checkcolumn',
					listeners: {
						checkchange: function(checkColumn, rowIndex, checked, eOpts){
							selectDayOfWeek(3, rowIndex);
							return true;
						}
					}
				},
				{
					width: 70,
					header: 'Четверг',
					align: 'center',
					dataIndex: 'thursday',
					xtype: 'checkcolumn',
					listeners: {
						checkchange: function(checkColumn, rowIndex, checked, eOpts){
							selectDayOfWeek(4, rowIndex);
							return true;
						}
					}
				},
				{
					width: 70,
					header: 'Пятница',
					align: 'center',
					dataIndex: 'friday',
					xtype: 'checkcolumn',
					listeners: {
						checkchange: function(checkColumn, rowIndex, checked, eOpts){
							selectDayOfWeek(5, rowIndex);
							return true;
						}
					}
				}
			],
			tbar: [
				{
					text    : 'Сохранить',
					handler : function() {
						scheduleStore.proxy.extraParams={
							ddate: Ext.getCmp('ddate').getValue(),
						};
						scheduleStore.sync({
							callback: function(batch){
								if(batch.exceptions.length>0){
									Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
								} else {
									loadSchedule();
								}
							}
						});
					}
				},
				{
					text: 'Распечатать',
					icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png',
					handler : function(){
						Ext.ux.grid.Printer.printAutomatically=true;
						Ext.ux.grid.Printer.closeAutomaticallyAfterPrint=true;
						Ext.ux.grid.Printer.extraCSS=['/ext/resources/css/ext-all.css'];
						Ext.ux.grid.Printer.print(schedulePanel);
					}
				}
			],
			plugins: [cellEditing]
		});
		
		var mainContainer=Ext.create('Ext.panel.Panel', {
			height: 600,
			layout: 'border',
			resizable: true,
			renderTo: Ext.get('placeunload_schedule_js'),
			items: [
				{
					region: 'north',
					xtype: 'panel',
					items: [filterPanel]
				},
				schedulePanel
			]
		});
	}
});