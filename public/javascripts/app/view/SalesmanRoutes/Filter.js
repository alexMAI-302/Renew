//фильтр
Ext.define('app.view.SalesmanRoutes.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.Filter',
	
	cls: 'Filter',
	
	date: new Date(),
    
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
			id: 'palmUnitCombo',
			xtype: 'combobox',
			fieldLabel: 'Бриагада',
			displayField: 'name',
			valueField: 'id',
			queryMode: 'local',
			allowBlank: false,
			width: 250,
			labelWidth: 75
		},
		{
			id: 'ddate',
			xtype: 'datefield',
			fieldLabel: 'Дата',
			format: 'd.m.Y',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			value: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'),
			width: 125,
			labelWidth: 25
		},
		{
			xtype: 'button',
			id: 'refreshInfo',
			icon: '/ext/examples/shared/icons/fam/table_refresh.png'
		}
	]
});