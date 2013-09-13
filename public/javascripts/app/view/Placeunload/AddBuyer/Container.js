Ext.define('app.view.Placeunload.AddBuyer.Container', {
    extend: 'Ext.panel.Panel',
	
	requires: [
		'app.view.Placeunload.AddBuyer.BuyerPropertiesGrid',
		'app.view.Placeunload.AddBuyer.SearchContainer',
		'app.view.Placeunload.AddBuyer.Grid',
		'app.view.Placeunload.AddBuyer.PlaceunloadPropertiesGrid'
	],
	
	renderTo: 'placeunload_add_buyer_js',
	width: '100%',
	height: Ext.getBody().getViewSize().height - 120,
	resizable: true,
	
	layout: {
		type: 'border'
	},
	
	items: [
		{
			region: 'west',
			width: 475,
			split: true,
			layout: 'border',
			items:[
				{
					height: 105,
					region: 'north',
					xtype: 'buyerPropertiesGrid'
				},
				{
					region: 'center',
					title: 'Адрес разгрузки',
					id: 'placeunloadsContainer',
					tbar: [
						{
							id: 'placeunloadMode',
							xtype: 'button',
							text: 'Новый адрес',
							enableToggle: true
						}
					],
					layout: {
						type: 'card'
					},
					items: [
						{
							xtype: 'placeunloadsGrid'
						},
						{
							xtype: 'placeunloadPropertiesGrid'
						}
					]
				},
				{
					region: 'south',
					width: '100%',
					xtype: 'button',
					text: 'Сохранить',
					id: 'savePlaceunload'
				}
			]
		},
		{
			region: 'center',
			layout: 'border',
			items:[
				{
					xtype: 'searchAddressContainer',
					region: 'north'
				},
				{
					region: 'center',
					width: '100%',
					height: '100%',
					xtype: 'component',
					autoEl:{
						tag: 'div'
					},
					id: 'placeunloadAddBuyerMap'
				}
			]
		}
	]
});