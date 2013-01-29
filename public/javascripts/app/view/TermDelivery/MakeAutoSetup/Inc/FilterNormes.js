//фильтр
Ext.define('app.view.TermDelivery.MakeAutoSetup.Inc.FilterNormes', {
	extend: 'Ext.container.Container',
	alias: 'widget.normesFilter',
    
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
			id: 'ddatebNormes',
			xtype: 'datefield',
			fieldLabel: 'С',
			format: 'd.m.Y',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			value: Ext.Date.add(Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'), Ext.Date.MONTH, -1),
			width: 125,
			labelWidth: 25
		},
		{
			id: 'ddateeNormes',
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
			id: 'filterNormes',
			xtype: 'button',
			text: 'Фильтр'
		}
	]
});
