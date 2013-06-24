Ext.define('app.view.gitSearch.Filter', {
	extend: 'Ext.form.Panel',
	
	alias: 'widget.gitSearchFilter',
    
    layout: {
		type: 'hbox'
	},

	defaults: {
		style: {
			margin: '5px'
		}
	},
	
	frame: true,
	
	items: [
		{
			id: 'messageText',
			xtype: 'textfield',
			fieldLabel: 'Message',
			width: 250,
			allowBlank: false,
			labelWidth: 50
		},
		{
			id: 'searchButton',
			xtype: 'button',
			text: 'Найти',
	        formBind: true           //Если мессадж не заполнен, то ничего не ищем
		},
	]
});