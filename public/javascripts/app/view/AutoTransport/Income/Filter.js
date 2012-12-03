//фильтр
Ext.define('app.view.AutoTransport.Income.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.incomeFilter',
    
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
			id: 'ddatebIncome',
			xtype: 'datefield',
			fieldLabel: 'С',
			format: 'd.m.Y',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			value: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'),
			width: 125,
			labelWidth: 25
		},
		{
			id: 'ddateeIncome',
			xtype: 'datefield',
			fieldLabel: 'По',
			format: 'd.m.Y',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			value: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'),
			width: 125,
			labelWidth: 25
		},
		{
			id: 'filterIncome',
			xtype: 'button',
			text: 'Фильтр'
		},
		{
			id: 'saveIncome',
			icon: '/images/save.png',
			xtype: 'button'
		}
	]
});