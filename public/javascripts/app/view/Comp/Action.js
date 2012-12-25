//фильтр
Ext.define('app.view.Comp.Action', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.compAction',
    
    layout: {
		type: 'vbox'
	},
	defaults: {
		style: {
			margin: '5px'
		},
		width: 300,
		labelWidth: 80
	},
	title: 'Перенос',
	disabled: true,
	width: 350,
	id: 'actionPanel',
	items: [
		{
			id: 'actionDestinationComp',
			xtype: 'combobox',
			fieldLabel: 'Куда',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local'
		},
		{
			id: 'actionPersonComp',
			xtype: 'combobox',
			fieldLabel: 'Кто',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local'
		},
		{
			id: 'actionTerminalComp',
			xtype: 'combobox',
			fieldLabel: 'Терминал',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			allowNull: true
		},
		{
			id: 'actionDescrComp',
			xtype: 'textfield',
			fieldLabel: 'Комментарий'
		},
		{
			id: 'actionMoveComp',
			xtype: 'button',
			text: 'Перенести'
		}
	]
});