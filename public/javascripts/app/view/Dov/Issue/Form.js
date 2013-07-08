//фильтр
Ext.define('app.view.Dov.Issue.Form', {
	extend: 'Ext.container.Container',
	alias: 'widget.dovIssueForm',
    
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
			id: 'palmSalesmanIssue',
			xtype: 'combobox',
			fieldLabel: 'Торг. пред.',
			queryMode: 'local',
			valueField: 'id',
			displayField: 'name',
			store: Ext.create('app.store.Dov.PalmSalesmans')
		},
		{
			id: 'quantityIssue',
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
					id: 'printDov',
					xtype: 'button',
					text: 'Распечатать'
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