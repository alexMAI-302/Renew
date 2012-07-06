//проба
Ext.define('app.view.mag.palmSaleOrders.filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.ordersFilter',
	
	cls: 'ordersFilter',
    
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
			id: 'startDate',
			xtype: 'datefield',
			name: 'startDate',
			fieldLabel: 'Начало периода',
			format: 'd.m.Y H:i',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			value: Ext.Date.add(new Date(Ext.Date.now()), Ext.Date.DAY, -1)
		},
		{
			id: 'endDate',
			xtype: 'datefield',
			name: 'endDate',
			fieldLabel: 'Конец периода',
			format: 'd.m.Y H:i',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			value: new Date(Ext.Date.now())
		},
		{
			xtype: 'button',
			text: 'Фильтр'
		}
	]
});