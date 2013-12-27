//фильтр
Ext.define('app.view.TerminalKey.Filter', {
	extend: 'Ext.form.Panel',
	alias: 'widget.terminalkeyFilter',
    
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
			xtype: 'textfield',
			fieldLabel: 'Наименование',
			id : 'nameTextfield',			
			labelAlign: 'right',
			allowBlank: true,
			width: 300
		},
		{
				id : 'filterTerminalKey',
				xtype : 'button',
				icon : '/ext/resources/themes/images/default/grid/refresh.gif',
				tooltip: 'Фильтр/обновить'
		}

	]	
});