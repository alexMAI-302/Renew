Ext.define('app.view.Placeunload.AddBuyer.PlaceunloadPropertiesGrid', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.placeunloadPropertiesGrid',
	
	layout: 'vbox',
	items: [
		{
			xtype: 'textfield',
			id: 'newPlaceunloadName',
			fieldLabel: "Наименование",
			width: '100%',
			labelWidth: 110,
			allowBlank: false
		},
		{
			xtype: 'combobox',
			valueField: 'id',
			displayField: 'name',
			id: 'newPlaceunloadPlacecategory',
			store: 'Placeunload.AddBuyer.Placecategories',
			queryMode: 'local',
			fieldLabel: "Категория точки",
			width: '100%',
			labelWidth: 110,
			allowBlank: false
		},
		{
			xtype: 'combobox',
			valueField: 'id',
			displayField: 'name',
			id: 'newPlaceunloadUnloading',
			queryMode: 'local',
			store: {
				fields: ['id', 'name'],
				data: [
					{name: '__Не определено', id: -1},
					{name: '15 мин', id: 15},
					{name: '30 мин', id: 30},
					{name: '45 мин', id: 45},
					{name: '1 час', id: 60},
					{name: '2 час', id: 120},
					{name: '4 час', id: 240}
				] 
			},
			fieldLabel: "Продолжительность разгрузки",
			width: '100%',
			labelWidth: 180,
			allowBlank: false
		},
		{
			xtype: 'combobox',
			valueField: 'id',
			displayField: 'name',
			id: 'newPlaceunloadDelschedule',
			store: 'Placeunload.AddBuyer.Schedules',
			queryMode: 'local',
			editable: false,
			fieldLabel: "Время приемки",
			width: '100%',
			labelWidth: 110,
			allowBlank: false
		},
		{
			xtype: 'combobox',
			valueField: 'id',
			displayField: 'name',
			id: 'newPlaceunloadIncschedule',
			store: 'Placeunload.AddBuyer.Schedules',
			queryMode: 'local',
			editable: false,
			fieldLabel: "Время инкассации",
			width: '100%',
			labelWidth: 110,
			allowBlank: false
		},
		{
			xtype: 'combobox',
			valueField: 'id',
			displayField: 'name',
			id: 'newPlaceunloadRoute',
			store: 'Placeunload.AddBuyer.Routes',
			queryMode: 'local',
			fieldLabel: "Маршрут",
			width: '100%',
			labelWidth: 110,
			allowBlank: false
		},
		{
			xtype: 'textfield',
			id: 'newPlacunloadDescr',
			fieldLabel: "Примечание",
			width: '100%',
			labelWidth: 110
		}
	]
});