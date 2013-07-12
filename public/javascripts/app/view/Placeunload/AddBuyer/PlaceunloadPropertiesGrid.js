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
				fields: ["id", "name"],
				data: [
					{id: -1, name: '__Не определено'},
					{id: 15, name: '15 мин'},
					{id: 30, name: '30 мин'},
					{id: 45, name: '45 мин'},
					{id: 60, name: '1 час'},
					{id: 120, name: '2 час'},
					{id: 240, name: '4 час'}
				]
			},
			value: -1,
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
			allowBlank: false,
			disabled: true
		},
		{
			xtype: 'textfield',
			id: 'newPlacunloadDescr',
			fieldLabel: "Примечание",
			width: '100%',
			labelWidth: 110
		},
		{
			xtype: 'combobox',
			valueField: 'id',
			displayField: 'name',
			id: 'dow',
			multiSelect: true,
			store: {
  				fields: ['id', 'name'],
    			data : [
					{"id":1, "name":"Понедельник"},
					{"id":2, "name":"Вторник"},
					{"id":3, "name":"Среда"},
					{"id":4, "name":"Четверг"},
					{"id":5, "name":"Пятница"},
        		]
			},
			queryMode: 'local',
			fieldLabel: "День доставки",
			width: '100%',
			labelWidth: 110,
			allowBlank: false
		}
	]
});