Ext.define('app.view.TermDelivery.MonitorTabs.TechRequest.Filter', {
    extend: 'Ext.container.Container',
	alias: 'widget.filterTechRequest',
  
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
				id: 'techrequestZone',
				xtype: 'combobox',
				fieldLabel: 'Зона',
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				allowNull: true,
				width: 170,
				labelWidth: 25,
				store: 'TermDelivery.MonitorTabs.TechRequest.Zones'
			},
			{
				id: 'techrequestDdate',
				xtype: 'datefield',
				name: 'ddate',
				fieldLabel: 'Дата',
				format: 'd.m.Y',
				altFormat: 'd/m/Y|d m Y',
				startDay: 1,
				value: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'),
				allowNull: true,
				width: 150,
				labelWidth: 50	
			}
	]
});
