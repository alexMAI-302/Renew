Ext.define('app.view.AutoTransport.Nomenclature.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.nomenclatureTab',
	
	requires: [
		'app.view.AutoTransport.Nomenclature.ItemsGrid',
		'app.view.AutoTransport.Nomenclature.Grid'
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
					id: 'saveNomenclatureGroup',
					icon: '/images/save.png'
				},
				{
					id: 'refreshNomenclatureGroup',
					icon: '/ext/examples/shared/icons/fam/table_refresh.png'
				}
			]
		},
		{
			xtype: 'nomenclatureGroupGrid',
			region: 'west',
			split: true,
		},
		{
			xtype: 'nomenclatureGrid',
			region: 'center'
		}
	]
});