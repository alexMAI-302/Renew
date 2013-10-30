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
			id: 'rewriteBuyersRoutes',
			xtype : 'button',
			icon : '/images/hammer.png',
			tooltip: 'Пересохранить все координаты всех зон'
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