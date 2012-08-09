//фильтр
Ext.define('app.view.mag.palmSaleOrders.filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.ordersFilter',
	
	cls: 'ordersFilter',
	
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
			id: 'startDate',
			xtype: 'datefield',
			name: 'startDate',
			fieldLabel: 'Начало периода',
			format: 'd.m.Y H:i',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			value: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d')
		},
		{
			id: 'endDate',
			xtype: 'datefield',
			name: 'endDate',
			fieldLabel: 'Конец периода',
			format: 'd.m.Y H:i',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			value: Ext.Date.parse(Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, +1), 'Y.m.d'), 'Y.m.d')
		},
		{
			id: 'filterPalmSales',
			xtype: 'button',
			text: 'Фильтр'
		}
	]
});