Ext.define('app.view.TermDelivery.MakeAutoSetup.Inc.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.incTab',
	
	requires: [
		'app.view.TermDelivery.MakeAutoSetup.Inc.GridNormes',
		'app.view.TermDelivery.MakeAutoSetup.Inc.GridWorkdays'
	],
	
	title: 'Настройка зон инкассаторов',
	
	items: [
		{
			xtype: 'normesGrid'
		},
		{
			xtype: 'workdaysGrid'
		}
	]
});