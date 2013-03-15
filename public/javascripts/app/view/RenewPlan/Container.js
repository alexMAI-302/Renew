Ext.define('app.view.RenewPlan.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.renewPanel',
	
	requires: [
		'app.view.RenewPlan.Grid',
		'app.view.RenewPlan.ItemsGrid',
		'app.view.RenewPlan.Action',
		'app.view.RenewPlan.GroupInfo'
	],
	
	renderTo: 'renew_plan_js',
	width: '100%',
	height: 700,
	
	layout: {
		type: 'border'
	},
	
	items: [
		{
			xtype: 'renewPlanPanel',
			
			region: 'center',
			flex: 1
		},
		{
			xtype: 'renewPlanAction',
			collapsible: true,
			region: 'east'
		},
		{
			region: 'south',
			split: true,
			flex: 1,
			xtype: 'renewPlanGoodsPanel'
		}
	]
});