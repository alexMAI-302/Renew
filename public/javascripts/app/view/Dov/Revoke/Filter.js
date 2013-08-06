//фильтр
Ext.define('app.view.Dov.Revoke.Filter', {
	extend: 'app.view.Lib.DateIntervalFilter',
	alias: 'widget.dovRevokeFilter',
    
	defaults: {
		style: {
			margin: '5px'
		}
	},
	
	config: {
		suffix: 'Revoke',
		shiftInterval: Ext.Date.MONTH,
		shiftBegin: -1,
		filterButton: false,
		filterItems: [
			{
				id: 'palmSalesman',
				xtype: 'combobox',
				fieldLabel: 'Торг. пред.',
				queryMode: 'local',
				valueField: 'id',
				displayField: 'name',
				labelWidth: 80,
				store: Ext.create('app.store.Dov.PalmSalesmans')
			},
			{
				xtype: 'textfield',
				id: 'filterNdoc',
				fieldLabel: 'Номер<br/>(Нажмите Enter для поиска)',
				labelWidth: 170
			},
			{
				id: 'showAll',
				xtype: 'checkbox',
				fieldLabel: 'Показывать возвращенные',
				value: false,
				labelWidth: 90
			}
		]
	}
});