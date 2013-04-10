//фильтр
Ext.define('app.view.RenewPlan.FilterDetail', {
	extend: 'Ext.container.Container',
	alias: 'widget.renewPlanFilterDetail',
    
    layout: {
		type: 'hbox'
	},
	
	defaults: {
		style: {
			margin: '5px'
		}
	},
	items: [
		{
			id: 'filterSellerRenewPlanGoods',
			xtype: 'combobox',
			fieldLabel: 'Поставщик',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			allowNull: true,
			width: 250,
			labelWidth: 65,
			listeners: {
				select: function(field){
					field.getStore().clearFilter(true);
					return true;
				}
			}
		}
	]
});