Ext.define('app.view.üùìóüóòåÂøàà.MainContainer', {
    extend: 'Ext.container.Container',
	
	requires: ['app.view.movementDiff.'],
	
	id: 'MainContainer',

    layout: {
		type: 'fit'
	},
	
	renderTo: Ext.get('movement_diff_js'),
	border: 1,
	style: {borderColor:'#000000', borderStyle:'solid', borderWidth:'1px'},
	defaults: {
		labelWidth: 80,
		style: {
			padding: '10px'
		}
	},
	items: [
        { xtype: 'diffsContainer'}
    ]
});