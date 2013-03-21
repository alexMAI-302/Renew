//фильтр
Ext.define('app.view.GeoPoint.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.geoPointFilter',
    
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
			id: 'filterSubdealerGeoPoint',
			xtype: 'combobox',
			fieldLabel: 'Дилер',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			width: 200,
			labelWidth: 40
		},
		{
			id: 'filterPointsGeoPoint',
			xtype: 'combobox',
			fieldLabel: 'Точки',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			width: 180,
			labelWidth: 40
		},
		{
			id: 'filterTerminalStrGeoPoint',
			xtype: 'textfield',
			fieldLabel: 'Имя или адрес',
			width: 250,
			labelWidth: 90
		},
		{
			id: 'filterTerminalIdGeoPoint',
			xtype: 'textfield',
			fieldLabel: 'Номер',
			width: 250,
			labelWidth: 40
		}
	]
});