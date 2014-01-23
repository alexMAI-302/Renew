//фильтр
Ext.define('app.view.Placeunload.points.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.placeunloadFilter',
    
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
			id: 'filterNamePlaceunload',
			xtype: 'textfield',
			fieldLabel: 'Вывеска',
			width: 200,
			labelWidth: 50
		},
		{
			id: 'filterAddressPlaceunload',
			xtype: 'textfield',
			fieldLabel: 'Адрес',
			width: 200,
			labelWidth: 40
		},
		{
			id: 'filterIscheckPlaceunload',
			xtype: 'combobox',
			fieldLabel: 'Проверен',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			allowNull: true,
			editeable: false,
			width: 140,
			labelWidth: 65,
			store: {
				fields: ['id', 'name'],
				data: [
					{ id: -1, name: 'Все'},
					{ id: 0, name: 'Да'},
					{ id: 1, name: 'Нет'}
				]
			}
		},
		{
			id: 'filterTpPlaceunload',
			xtype: 'textfield',
			fieldLabel: 'ТП',
			width: 200,
			labelWidth: 20
		},
		{
			id: 'filterBuyersRoutePlaceunload',
			xtype: 'combobox',
			fieldLabel: 'Маршрут',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			allowNull: true,
			editable: false,
			width: 250,
			labelWidth: 60,
			store: 'Placeunload.Routes'
		},
		{
			id: 'filterDdatePlaceunload',
			xtype: 'textfield',
			fieldLabel: 'Древность',
			width: 100,
			labelWidth: 65
		},
		{
			id: 'filterNotgeoPlaceunload',
			xtype: 'checkbox',
			fieldLabel: 'Не геокодированы',
			width: 135,
			labelWidth: 110
		},
		{
			id : 'filterPlaceunloads',
			xtype : 'button',
			icon : '/ext/resources/themes/images/default/grid/refresh.gif',
			tooltip: 'Фильтр/обновить'
		},
		{
			id : 'savePlaceunloads',
			xtype : 'button',
			icon : '/images/save.png',
			tooltip: 'Сохранить'
		}
	]
});