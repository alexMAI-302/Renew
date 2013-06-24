Ext.define('app.view.Dov.Container', {
    extend: 'Ext.tab.Panel',

    layout: {
		type: 'fit'
	},
	
	height: Ext.getBody().getViewSize().height - 120,
	id: 'DovMain',
	renderTo: Ext.get('dov_js'),
	
	items: [
    ]
});