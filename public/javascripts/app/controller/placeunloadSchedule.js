Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn',
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
		}
	
		function loadSchedule(){
			schedulePanel.setLoading(true);
			scheduleStore.proxy.extraParams={
				salesman_id: salesmansCombo.value
			};
			scheduleStore.load();
		}
	
		var salesmansStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'rest',
				url : '/placeunload_schedule/get_salesman',
				reader: {
					type: 'json'
				}
			}
		});
		
		var scheduleStore = Ext.create('Ext.data.Store', {
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
		});
	
		var mainContainer=Ext.create('Ext.container.Container', {
			layout: {
				type: 'fit'
			},
			renderTo: Ext.get('placeunload_schedule_js'),
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
			}
		});
		
		var salesmansCombo=Ext.create('Ext.form.ComboBox', {
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
		});
		
		var filterSchedule=Ext.create('Ext.Button', {
			text    : 'Фильтр',
			handler : loadSchedule
		});
		
		filterPanel.add(salesmansCombo);
		filterPanel.add(filterSchedule);
		mainContainer.add(filterPanel);
		
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		
		var gridId='scheduleTable';
		var schedulePanel=Ext.create('Ext.grid.Panel', {
			id: gridId,
			title: 'График доставок',
			store: scheduleStore,
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
					xtype: 'checkcolumn'
				},
				{
					width: 70,
					header: 'Вторник',
					align: 'center',
					dataIndex: 'tuesday',
					xtype: 'checkcolumn'
				},
				{
					width: 70,
					header: 'Среда',
					align: 'center',
					dataIndex: 'wednesday',
					xtype: 'checkcolumn'
				},
				{
					width: 70,
					header: 'Четверг',
					align: 'center',
					dataIndex: 'thursday',
					xtype: 'checkcolumn'
				},
				{
					width: 70,
					header: 'Пятница',
					align: 'center',
					dataIndex: 'friday',
					xtype: 'checkcolumn'
				}
			],
			tbar: [
				{
					text    : 'Сохранить',
					handler : function() {
						scheduleStore.proxy.extraParams=null;
						scheduleStore.sync(function(){
							loadSchedule();
						});
					}
				},
				{
					text: 'Распечатать',
					icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png',
					handler : function(){
						Ext.ux.grid.Printer.printAutomatically=true;
						Ext.ux.grid.Printer.closeAutomaticallyAfterPrint=true;
						Ext.ux.grid.Printer.extraCSS=['/ext/examples/ux/css/CheckHeader.css'];
						Ext.ux.grid.Printer.print(schedulePanel);
					}
				}
			],
			plugins: [cellEditing]
		});
		
		mainContainer.add(schedulePanel);
	}
});