//фильтр
Ext.define('app.view.BuyersRoute.Filter', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.buyersRouteFilter',
	
	layout: {
		type: 'hbox'
	},
	
	defaults : {
		style : {
			margin : '5px'
		}
	},
	
	items: [
		{
			id: 'filterSiteBuyersRoute',
			xtype: 'combobox',
			fieldLabel: 'Площадка',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			allowNull: false,
			width: 170,
			labelWidth: 60
		},
		{
			id: 'filterTariffBuyersRoute',
			xtype: 'combobox',
			fieldLabel: 'Тариф',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			allowNull: false,
			width: 170,
			labelWidth: 40
		},
		{
			id: 'filterBuyersRoute',
			xtype : 'button',
			icon : '/ext/resources/themes/images/default/grid/refresh.gif',
			tooltip: 'Фильтр/обновить'
		},
		{
			id: 'saveBuyersRoute',
			xtype : 'button',
			icon : '/images/save.png',
			tooltip: 'Сохранить'
		},
		{
			id: 'loadCSVBuyersRoute',
			xtype : 'button',
			icon : '/images/excel.gif',
			href: '/buyers_route/get_info_csv?points=',
			tooltip: 'Загрузить информацию по точкам в маршруте'
		},
		{
			id: 'pointsInZoneBuyersRoute',
			xtype: 'textfield',
			fieldLabel: 'Точек в зоне',
			disabled: true,
			width: 150,
			labelWidth: 80
		}
	]
});