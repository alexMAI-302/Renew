//фильтр
Ext.define('app.view.Dov.Form', {
	extend: 'Ext.container.Container',
	alias: 'widget.dovForm',
    
    layout: {
		type: 'vbox'
	},
	defaults: {
		style: {
			margin: '5px'
		},
		width: 300,
		labelWidth: 80
	},
	items: [
		{
			id: 'palmSalesman',
			xtype: 'combobox',
			fieldLabel: 'Торг. пред.',
			valueField: 'id',
			displayField: 'name'
		},
		{
			id: 'quantity',
			fieldLabel: 'Количество',
			xtype: 'numberfield',
			value: 1,
			minValue: 1,
			allowDecimals: false
		},
		{
			layout: 'hbox',
			id: 'operations',
			width: 335,
			border: false,
			defaults: {
				style: {
					margin: '5px'
				}
			},
			disabled: true,
			items: [
				{
					id: 'createDov',
					xtype: 'button',
					text: 'Выдать доверенности'
				},
				{
					xtype: 'button',
					text: 'Распечатать все',
					href: '/',
					target: '_blank',
					id: 'printDov'
				},
				{
					xtype: 'button',
					text: 'Удалить все',
					id: 'deleteDov'
				}
			]
		}
	]
});