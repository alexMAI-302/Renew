Ext.define('app.view.exclusivePoint.Filter', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.exclusivePointFilter',
    
    layout: {
		type: 'hbox'
	},

	defaults: {
		style: {
			margin: '5px'
		}
	},
	
	//frame: true,
	
	items: [
		{
			id: 'meterField',
			xtype: 'numberfield',
			fieldLabel: 'Метры',
			width: 250,
			allowBlank: false,
			value: 100,
			maxValue: 1000, //1км
			labelWidth: 50,
			width: 120
		},
		{
			id: 'refreshButton',
			xtype: 'button',
			text: 'Найти',
	        //formBind: true           //Если мессадж не заполнен, то ничего не ищем
		},
	]
});