//фильтр
Ext.define('app.view.TermDelivery.MonitorTabs.MonitorTab.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.Filter',
	
	cls: 'Filter',
    
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
			id: 'zoneTypeCombo',
			xtype: 'combobox',
			fieldLabel: 'Тип зоны',
			displayField: 'name',
			valueField: 'id',
			queryMode: 'local',
			allowBlank: false,
			width: 200,
			labelWidth: 100,
			store: 'TermDelivery.MonitorTabs.MonitorTab.ZoneTypes'
		},
		{
			id: 'ddate',
			xtype: 'datefield',
			name: 'ddate',
			fieldLabel: 'Дата',
			format: 'd.m.Y',
			altFormat: 'd/m/Y|d m Y',
			startDay: 1,
			value: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'),
			width: 150,
			labelWidth: 50
		},
		{
			id: 'onlyWithErrors',
			xtype: 'checkbox',
			fieldLabel: 'Только с ошибками',
			labelWidth: 120,
			width: 145
		},
		{
			id: 'onlyInRoute',
			xtype: 'checkbox',
			fieldLabel: 'Только в маршруте',
			labelWidth: 120,
			width: 145
		},
		{
			id: 'filterRoutes',
			xtype: 'button',
			text: 'Фильтр'
		}
	]
});