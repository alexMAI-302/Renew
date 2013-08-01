Ext.define('app.view.ClothingSize.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.clothingsize',
	
	requires: [
		'app.view.ClothingSize.Grid',
		'app.view.ClothingSize.ItemsGrid'
	],
	
	title: 'Размеры',
	renderTo: 'clothing_size_js',
	width: '100%',
	height: Ext.getBody().getViewSize().height - 120,
	resizable: true,
	
	layout: {
		type: 'border'
	},

	items: [
		{
			xtype: 'deptGrid',
			width: 400,
			region: 'west',
			split: true,
		},
		{
			xtype: 'clothingsizeGrid',
			region: 'center'
		}
	]
});