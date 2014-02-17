//таблица
Ext.define('app.view.TermDelivery.MonitorTabs.MonitorTab.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.routesGrid',
	
	cls: 'routes-grid',
    
    id: 'routesTable',
    store: 'TermDelivery.MonitorTabs.MonitorTab.Routes',
	columns: [
		{
			xtype: 'checkcolumn',
			width: 25,
			id: 'includeInAutoRoute',
			dataIndex: 'include_in_auto_route',
			sortable: false,
			hideable: false,
			menuDisabled: true,
			draggable: false
		},
		{
			width: 100,
			header: 'Маршрут',
			dataIndex: 'name'
		},
		{
			header: 'Терминалов',
			columns: [
				{
					header: 'Всего',
					align: 'center',
					dataIndex: 'points',
					width: 50
				},
				{
					header: 'В<br/>маршруте',
					align: 'center',
					dataIndex: 'points_inroute',
					width: 60
				}
			]
		},
		{
			xtype: 'checkcolumn',
			width: 25,
			header: 'ИЗ',
			align: 'center',
			id: 'delivery_status4',
			beforecheckchange: function(checkColumn, rowIndex, checked, eOpts){
				return Ext.getCmp('routesTable').store.getAt(rowIndex).get('delivery')>0;
			},
			dataIndex: 'delivery_status4'
		},
		{
			xtype: 'actioncolumn',
			width: 25,
			align: 'center',
			id: 'printRoute',
			icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png',
			handler: function(view, rowIndex, colIndex, item, e){
				var currentRecord=view.store.getAt(rowIndex),
					ddate = new Date(Ext.getCmp('ddate').getValue());
				
				window.open(
					"/term_delivery/monitor/route_print?zone="+currentRecord.get('id')+
					"&ddate="+Ext.Date.format(ddate, 'Y-m-d')+
					"&rel=external", "", "");
			}
		},
		{
			xtype: 'actioncolumn',
			width: 25,
			align: 'center',
			icon: '/images/excel.gif',
			handler: function(view, rowIndex, colIndex, item, e){
				var currentRecord=view.store.getAt(rowIndex),
					ddate = new Date(Ext.getCmp('ddate').getValue()),
					zoneTypeId = Ext.getCmp('zoneTypeCombo').getValue(),
					onlyWithErrors = Ext.getCmp('onlyWithErrors').getValue(),
					onlyInRoute = Ext.getCmp('onlyInRoute').getValue();
				
				window.open(
					"/term_delivery/monitor/route_export?zone="+currentRecord.get('id')+
					"&ddate="+Ext.Date.format(ddate, 'Y-m-d')+
					"&zone_type_id="+zoneTypeId+
					"&only_with_errors="+onlyWithErrors+
					"&only_in_route="+onlyInRoute+
					"&rel=external", "", "");
			}
		}
	],
	tbar: [
		{
			text: 'Сохранить ИЗ',
			id: 'saveIS'
		},
		{
			text: 'Сформировать доставки автоматически',
			id: 'makeDeliveryAuto'
		}
	],
	selModel: {
		selType: 'rowmodel'
	},
	width: 330,
	viewConfig: {
		enableTextSelection: true
	},
	checkIncludeInAutoRoute: true
});