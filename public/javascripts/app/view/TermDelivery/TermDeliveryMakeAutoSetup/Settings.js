//фильтр
Ext.define('app.view.TermDelivery.MakeAutoTechSetup.Settings', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.settingsPanel',
    
    layout: {
		type: 'vbox'
	},
	defaults: {
		style: {
			margin: '5px'
		}
	},
	
	collapsible: true,
	
	title: 'Настройки запуска',
	items: [
		{
			id: 'startTime',
			xtype: 'timefield',
			format: 'H:i:s.u',
			fieldLabel: 'Начало запуска',
			increment: 30,
			width: 200,
			labelWidth: 100
		},
		{
			id: 'stopTime',
			xtype: 'timefield',
			format: 'H:i:s.u',
			fieldLabel: 'Конец запуска',
			increment: 30,
			width: 200,
			labelWidth: 100
		},
		{
			id: 'intervalAmt',
			xtype: 'numberfield',
			fieldLabel: 'Интервал',
			minValue: 10,
			maxValue: 59,
			width: 150,
			labelWidth: 100
		},
		{
			xtype: 'checkbox',
			id: 'eventEnabled',
			fieldLabel: 'Включено',
			width: 125,
			labelWidth: 100
		},
		{
			id: 'saveSettings',
			icon: '/images/save.png',
			xtype: 'button',
			text: 'Сохранить настройки'
		}
	]
});