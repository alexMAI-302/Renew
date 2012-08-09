Ext.define('app.view.mainContainer', {
    extend: 'Ext.container.Container',
	
	requires: ['app.view.mag.magTabs'],

    layout: {
		type: 'anchor'
	},
	
	renderTo: Ext.get('mag_js'),
	border: 1,
	style: {borderColor:'#000000', borderStyle:'solid', borderWidth:'1px'},
	defaults: {
		labelWidth: 80,
		style: {
			padding: '10px'
		}
	},
	items: [
        { xtype: 'magTabs'}
    ]
});