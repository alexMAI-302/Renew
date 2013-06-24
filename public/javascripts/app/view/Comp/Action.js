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
			queryMode: 'local',
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
			id: 'actionPersonComp',
			xtype: 'combobox',
			fieldLabel: 'Кто',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			store: 'Comp.Persons',
			listeners: {
				beforequery: function(queryEvent){
					queryEvent.combo.store.clearFilter();
					queryEvent.combo.store.filter(queryEvent.combo.displayField, queryEvent.query);
					return true;
				}
			}
		},
		{
			id: 'actionTerminalComp',
			xtype: 'combobox',
			fieldLabel: 'Терминал',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			allowNull: true,
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