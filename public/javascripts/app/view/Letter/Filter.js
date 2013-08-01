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
			xtype: 'combobox',
			fieldLabel: 'Период',
			id : 'periodCombo',			
			labelAlign: 'left',
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			labelWidth: 80,
			width: 260
		},
		{
				id : 'filterLetterLetters',
				xtype : 'button',
				icon : '/ext/resources/themes/images/default/grid/refresh.gif',
				tooltip: 'Фильтр/обновить'
		}
	]	
});