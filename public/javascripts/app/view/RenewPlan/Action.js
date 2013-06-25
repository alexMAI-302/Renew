//фильтр
Ext.define('app.view.RenewPlan.Action', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.renewPlanAction',
    
    layout: {
		type: 'vbox'
	},
	defaults: {
		style: {
			margin: '5px'
		},
		labelWidth: 60,
		width: 120
	},
	title: 'Операции над<br/>планируемой<br/>поставкой',
	disabled: true,
	width: 130,
	id: 'actionPanel',
	items: [
		{
			id: 'actionRenewPlanType',
			xtype: 'combobox',
			fieldLabel: 'Тип',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			store: 'RenewPlan.RenewPlanTypes',
			labelWidth: 30
		},
		{
			id: 'actionPlanRenewPlan',
			xtype: 'button',
			text: 'Рассчитать план'
		},
		{
			id: 'actionSiteToStorageRenewPlan',
			xtype: 'combobox',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			labelAlign: 'top',
			fieldLabel: 'Склад приемника:',
			store: {
				model: 'app.model.RenewPlan.SiteStorageModel',
				proxy: {
					type: 'memory'
				}
			}
		},
		{
			id: 'actionSorderRenewPlan',
			xtype: 'checkbox',
			fieldLabel: 'Заказ'
		},
		{
			id: 'actionSorderStatus1RenewPlan',
			xtype: 'checkbox',
			fieldLabel: 'Н'
		}
	]
});