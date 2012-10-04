//фильтр
Ext.define('app.view.TermDelivery.Filter', {
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
			xtype: 'combobox',
			fieldLabel: 'Субдилер',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false
		},
		{
			xtype: 'combobox',
			fieldLabel: 'Тип зоны',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false
		},
		{
			id: 'ddate',
			xtype: 'datefield',
			name: 'ddate',
			fieldLabel: 'Дата',
			format: 'd.m.Y',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			value: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d')
		},
		{
			id: 'filter',
			xtype: 'button',
			text: 'Фильтр'
		}
	]
});