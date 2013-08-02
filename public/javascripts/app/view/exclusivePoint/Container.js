Ext.define('app.view.exclusivePoint.Container', {
    extend: 'Ext.panel.Panel',
	
	requires: [
		'app.view.exclusivePoint.ExclusiveBuyer',
		'app.view.exclusivePoint.MultiBuyer',
		'app.view.exclusivePoint.Filter'
	],
	
	width: '100%',
	height: Ext.getBody().getViewSize().height - 120,
	
	layout: {
		type: 'border'
	},
	
	items: [
		{
			xtype: 'exclusivePointFilter',
			region: 'north'
		},	
		{
			region: 'east',
            collapsible: true,
            split: true,
            width: '45%',
            layout: {
                type: 'border',
                padding: 5
            },
            
			items: [{
				xtype: 'exclusivePointExclusiveBuyer',
				height: '50%',
				region: 'center'
			},{
				xtype: 'exclusivePointMultiBuyer',
				height: '50%',
				region: 'south',
				split: true,
			}]
		},
		{
			region: 'center',
			items:[{
				width: '100%',
				height: '100%',
				xtype: 'container',
				id: 'map'				
			}]
		}
	]
});