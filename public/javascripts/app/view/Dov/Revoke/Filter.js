//фильтр
Ext.define('app.view.Dov.Revoke.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.dovRevokeFilter',
    
    layout: {
		type: 'vbox'
	},
	items: [
		{
			xtype: 'container',
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
					id: 'palmSalesmanRevoke',
					xtype: 'combobox',
					fieldLabel: 'Торг. пред.',
					queryMode: 'local',
					valueField: 'id',
					displayField: 'name',
					labelWidth: 80,
					store: Ext.create('app.store.Dov.PalmSalesmans')
				},
				{
					id: 'showAllRevoke',
					xtype: 'checkbox',
					fieldLabel: 'Показывать возвращенные',
					value: false,
					labelWidth: 160
				}
			]
		},
		{
			style: {
				margin: '5px'
			},
			xtype: 'textfield',
			id: 'filterNdocRevoke',
			fieldLabel: 'Номер',
			labelWidth: 80
		}
	]
});