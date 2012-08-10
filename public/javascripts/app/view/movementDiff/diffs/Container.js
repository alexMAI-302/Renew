Ext.define('app.view.movementDiff.diffs.Container', {
    extend: 'Ext.container.Container',
	alias: 'widget.diffsContainer',
	
	requires: [
		'app.view.movementDiff.diffs.Filter',
		'app.view.movementDiff.diffs.Grid'
	],

	layout: {
		type: 'anchor'
	},
	
	items: [
        {
			xtype: 'diffsFilter'
		},
		{
			xtype: 'diffsGrid'
		}
    ]
});