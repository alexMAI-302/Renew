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
			width: 160
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
			xtype: 'combobox',
			fieldLabel: 'Менеджер',
			id : 'managerCombo',			
			labelAlign: 'right',
			displayField: 'name',
			valueField: 'id',
			allowBlank: true,
			labelWidth: 80,
			width: 250,
			editable: false
		},
		{
				id : 'filterLetterLetters',
				xtype : 'button',
				icon : '/ext/resources/themes/images/default/grid/refresh.gif',
				tooltip: 'Фильтр/обновить'
		}

	]	
});