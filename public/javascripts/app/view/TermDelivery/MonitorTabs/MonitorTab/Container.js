Ext.define('app.view.TermDelivery.MonitorTabs.MonitorTab.Container', {
    extend: 'Ext.container.Container',
	
	requires: [
		'app.view.TermDelivery.MonitorTabs.MonitorTab.Filter',
		'app.view.TermDelivery.MonitorTabs.MonitorTab.ItemsGrid',
		'app.view.TermDelivery.MonitorTabs.MonitorTab.Grid'
	],

    layout: {
		type: 'fit'
	},
	
	height: Ext.getBody().getViewSize().height - 120,
	config: {
		title: 'Мониторинг терминалов'
	},
	
	items: [
		{
			xtype: 'panel',
			layout: {
				type: 'border'
			},
			items: [
				{
					xtype: 'Filter',
					region: 'north'
				},
				{
					xtype: 'routesGrid',
					region: 'west',
					split: true
				},
				{
					xtype: 'terminalsGrid',
					region: 'center'
				}
			]
		}
    ]
});