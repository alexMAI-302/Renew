Ext.define('app.view.Fias.Filter', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.fiasFilter',

    layout: {
		type: 'vbox'
	},
	
	defaults: {
		style: {
			margin: '5px'
		}
	},


	items : [ 
		{
			xtype: 'combobox',
			fieldLabel: 'ФИАС',
			id : 'fiasCombo',			
			labelAlign: 'right',
			displayField: 'name',
			valueField: 'id',
			editable : true,
			allowBlank: false,
			labelWidth: 80,
			width: 600,
			region : 'north',
			emptyText : 'Кронштадтский',
			margin: '10 5 3 10'
		},
		{
			xtype: 'textfield',
			fieldLabel: 'Код',
			id : 'houseguidTextfield',			
			labelAlign: 'right',
			allowBlank: true,
			width: 400,
			region : 'south'
		}]
}); 