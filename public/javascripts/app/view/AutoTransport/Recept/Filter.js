//фильтр
Ext.define('app.view.AutoTransport.Recept.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.receptFilter',
    
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
			id: 'ddatebRecept',
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
			id: 'ddateeRecept',
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
			id: 'filterRecept',
			xtype: 'button',
			text: 'Фильтр'
		},
		{
			id: 'saveRecept',
			icon: '/images/save.png',
			xtype: 'button'
		}
	]
});