//фильтр
Ext.define('app.view.Comp.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.compFilter',
    
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
			defaults: {
				border: false,
				style: {
					margin: '5px'
				}
			},
			layout: 'vbox',
			items: [
				{
					layout: 'hbox',
					items: [
						{
							id: 'filterTypeComp',
							xtype: 'combobox',
							fieldLabel: 'Тип',
							valueField: 'id',
							displayField: 'name',
							queryMode: 'local',
							allowNull: true,
							width: 410,
							labelWidth: 25,
							store: 'Comp.Types',
							listeners: {
								beforequery: function(queryEvent){
									queryEvent.combo.store.clearFilter();
									queryEvent.combo.store.filter(queryEvent.combo.displayField, queryEvent.query);
									return true;
								}
							}
						},
						{
							id: 'filterSerialComp',
							xtype: 'textfield',
							fieldLabel: 'Номер',
							width: 200,
							labelWidth: 40
						}
					]
				},
				{
					layout: 'hbox',
					items: [
						{
							id: 'filterCompLocationComp',
							xtype: 'combobox',
							fieldLabel: 'Местонахождение',
							valueField: 'id',
							displayField: 'name',
							queryMode: 'local',
							allowNull: true,
							width: 250,
							labelWidth: 110,
							store: 'Comp.CompLocations',
							listeners: {
								beforequery: function(queryEvent){
									queryEvent.combo.store.clearFilter();
									queryEvent.combo.store.filter(queryEvent.combo.displayField, queryEvent.query);
									return true;
								}
							}
						},
						{
							id: 'filterTerminalComp',
							xtype: 'combobox',
							fieldLabel: 'Терминал',
							valueField: 'id',
							displayField: 'name',
							queryMode: 'local',
							allowNull: true,
							width: 160,
							labelWidth: 60,
							store: 'Comp.Terminals',
							listeners: {
								beforequery: function(queryEvent){
									queryEvent.combo.store.clearFilter();
									queryEvent.combo.store.filter(queryEvent.combo.displayField, queryEvent.query);
									return true;
								}
							}
						},
						{
							id: 'filterPersonComp',
							xtype: 'combobox',
							fieldLabel: 'Сотрудник',
							valueField: 'id',
							displayField: 'name',
							queryMode: 'local',
							allowNull: true,
							width: 200,
							labelWidth: 65,
							store: 'Comp.Persons',
							listeners: {
								beforequery: function(queryEvent){
									queryEvent.combo.store.clearFilter();
									queryEvent.combo.store.filter(queryEvent.combo.displayField, queryEvent.query);
									return true;
								}
							}
						}
					]
				}
			]
		},
		{
			id: 'filterComp',
			xtype: 'button',
			text: 'Фильтр'
		}
	]
});