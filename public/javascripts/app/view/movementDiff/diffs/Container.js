Ext.define('app.view.mag.palmSaleOrders.Container', {
    extend: 'Ext.container.Container',
	alias: 'widget.diffsContainer',
	
	requires: [
		'app.view.movementDiff.diffs.Filter',
		'app.view.movementDiff.diffs.Grid'
	],

    layout: {
		type: 'border'
	},
	
	items: [
        {
			region: 'north',
			xtype: 'diffsFilter'
		},
		{
			region: 'center',
			xtype: 'diffsGrid'
		}
    ]
});