//фильтр
Ext.define('app.view.Dov.Revoke.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.dovRevokeFilter',
    
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
			xtype: 'container',
			layout: {
				type: 'hbox'
			},
			items: [
				{
					id: 'palmSalesmanRevoke',
					xtype: 'combobox',
					fieldLabel: 'Торг. пред.',
					valueField: 'id',
					displayField: 'name'
				},
				{
					id: 'showAllRevoke',
					xtype: 'checkbox',
					value: false
				}
			]
		},
		{
			xtype: 'textfield',
			id: 'filterNdocRevoke',
			fieldLabel: 'Показывать возвращенные'
		}
	]
});