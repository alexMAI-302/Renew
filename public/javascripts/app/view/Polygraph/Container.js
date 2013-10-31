Ext.define('app.view.Polygraph.Container', {
    extend: 'Ext.tab.Panel',

    layout: {
		type: 'fit'
	},
	
	height: Ext.getBody().getViewSize().height - 120,
	id: 'PolygraphMain',
	renderTo: Ext.get('polygraph_js'),
	
 items:[]
});