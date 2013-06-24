Ext.define('app.view.Placeunload.AddBuyer.SearchContainer', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.searchAddressContainer',

	title: 'Геокодирование адреса',


	region: 'north',
	layout: {
		type: 'table',
		columns: 2,
		width: '100%'
	},
	items: [
		{
			width: '100%',
			id: 'addressPlaceunload',
			xtype: 'textfield'
		},
		{
			xtype: 'button',
			id: 'findAddressPlaceunload',
			icon: '/images/view.png',
			tooltip: 'Найти'
		},
		{
			colspan: 2,
			xtype: 'toolbar',
			width: '100%',
			id: 'sitesPointsPlaceunload'
		},
		{
			width: '100%',
			id: 'fulladdressPlaceunload',
			xtype: 'textfield',
			colspan: 2,
			readOnly: true
		}
	]
});