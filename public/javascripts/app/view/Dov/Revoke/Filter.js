//фильтр
Ext.define('app.view.Dov.Revoke.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.dovRevokeFilter',
    
    layout: {
		type: 'table',
		columns: 2
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
		},
		{
			xtype: 'textfield',
			id: 'filterNdocRevoke',
			fieldLabel: 'Номер',
			labelWidth: 80
		},
		{
			xtype: 'box',
			autoEl: {cn: '(Нажмите Enter для поиска)'}
		}
	]
});