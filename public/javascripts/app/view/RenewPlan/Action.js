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
			listeners: {
				select: function(field){
					field.getStore().clearFilter(true);
					return true;
				}
			},
			labelWidth: 30
		},
		{
			id: 'actionPlanRenewPlan',
			xtype: 'button',
			text: 'Рассчитать план'
		},
		{
			xtype: 'text',
			text: 'Склад приемника:',
			height: 20
		},
		{
			id: 'actionSiteToStorageRenewPlan',
			xtype: 'combobox',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			listeners: {
				select: function(field){
					field.getStore().clearFilter(true);
					return true;
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