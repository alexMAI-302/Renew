Ext.define('app.view.TechrequestCreate.Filter', {
    extend: 'Ext.container.Container',
	alias: 'widget.filterTechrequestCreate',
  
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
				id: 'filterRequestType',
				xtype: 'combobox',
				fieldLabel: 'Тип задания',
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				allowNull: true,
				width: 250,
				labelWidth: 70,
				store: 'TechrequestCreate.RequestTypes'
			},
			{
				id: 'filterZoneType',
				xtype: 'combobox',
				fieldLabel: 'Тип зоны',
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				allowNull: true,
				width: 170,
				labelWidth: 50,
				store: 'TechrequestCreate.ZoneTypes'
			},
			{
				id: 'filterZone',
				xtype: 'combobox',
				fieldLabel: 'Зона',
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				allowNull: true,
				width: 170,
				labelWidth: 25,
				store: 'TechrequestCreate.Zones'
			},
			{
				id: 'filterTerminalPrefix',
				xtype: 'textfield',
				allowNull: true,
				width: 250,
				labelWidth: 45,
				fieldLabel: 'Префикс',
				emptyText: 'терминалы независимо от зоны'
			},
			{
				id: 'filterCreateRequest',
				xtype: 'button',
				icon: '/images/hammer.png',
				tooltip: 'Создать заявки'
			},
			{
				id: 'filterRefreshRequest',
				xtype: 'button',
				icon: '/ext/resources/themes/images/default/grid/refresh.gif',
				tooltip: 'Обновить/фильтровать'
			}
	]
});
