//фильтр
Ext.define('app.view.TermDelivery.MakeAutoCommonSetup.Filter', {
	extend: 'Ext.container.Container',
	alias: 'widget.terminalsFilter',
    
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
			id: 'filterZoneCommon',
			xtype: 'combobox',
			fieldLabel: 'Зона',
			valueField: 'id',
			displayField: 'name',
			queryMode: 'local',
			allowNull: true,
			width: 200,
			labelWidth: 30,
			store: 'TermDelivery.MakeAutoCommonSetup.Zones'
		},
		{
			id: 'filterStrCommon',
			xtype: 'textfield',
			fieldLabel: 'Наименование/код/адрес',
			width: 400,
			labelWidth: 180
		},
		{
			id: 'filterTerminals',
			xtype: 'button',
			text: 'Фильтр'
		},
		{
			id: 'saveTerminals',
			icon: '/images/save.png',
			xtype: 'button'
		}
	]
});