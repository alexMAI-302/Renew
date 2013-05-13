Ext.define('app.view.AutoTransport.Nomenclature.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.nomenclatureTab',
	
	requires: [
		'app.view.AutoTransport.Nomenclature.Grid',
		'app.view.AutoTransport.Nomenclature.ItemsGrid'
	],
	
	layout: {
		type: 'border'
	},
	
	title: 'Номенклатура',
	
	items: [
		{
			xtype: 'toolbar',
			region: 'north',
			items:[
				{
					id: 'refreshNomenclatureGroup',
					icon : '/ext/resources/themes/images/default/grid/refresh.gif',
					tooltip: 'Обновить'
				},
				{
					id: 'saveNomenclatureGroup',
					icon: '/images/save.png',
					tooltip: 'Сохранить'
				}
			]
		},
		{
			xtype: 'nomenclatureGroupsGrid',
			width: 220,
			region: 'west',
			split: true,
		},
		{
			xtype: 'nomenclatureGrid',
			region: 'center'
		}
	]
});