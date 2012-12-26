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
			id: 'filterTypeComp',
			xtype: 'combobox',
			fieldLabel: 'Тип',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			allowNull: true,
			width: 400,
			labelWidth: 25,
			listeners: {
				select: function(field){
					field.getStore().clearFilter(true);
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
		},
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
			listeners: {
				select: function(field){
					field.getStore().clearFilter(true);
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
			listeners: {
				select: function(field){
					field.getStore().clearFilter(true);
					return true;
				}
			}
		},
		{
			id: 'filterComp',
			xtype: 'button',
			text: 'Фильтр'
		}
	]
});