//фильтр
Ext.define('app.view.Letter.Filter', {
	extend: 'Ext.form.Panel',
	alias: 'widget.letterFilter',
    
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
				id : 'printLetterLetters',
				xtype : 'button',
				text: 'Распечатать',
				tooltip: 'Печать'
		},
		{
			xtype: 'combobox',
			fieldLabel: 'Период',
			id : 'periodCombo',			
			labelAlign: 'right',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 80,
			width: 260
		},
		{
			xtype: 'textfield',
			fieldLabel: 'Префикс',
			id : 'prefixTextfield',			
			labelAlign: 'right',
			allowBlank: true,
			width: 200
		},
		{
				id : 'filterLetterLetters',
				xtype : 'button',
				icon : '/ext/resources/themes/images/default/grid/refresh.gif',
				tooltip: 'Фильтр/обновить'
		}

	]	
});