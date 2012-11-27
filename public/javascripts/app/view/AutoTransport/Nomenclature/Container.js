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
	
	items: [
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