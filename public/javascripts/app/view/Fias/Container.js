Ext.define('app.view.Fias.Container', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.fiasPanel',

//	requires : ['app.view.Letter.Filter', 'app.view.Lib.Grid.Panel', 'app.view.Lib.Grid.column.ComboColumn'],
	renderTo : 'fias_js',

	//width : '100%',
	layout : {
//		type : 'border',
		type: 'vbox',
  		align: 'left'
	},
	height : Ext.getBody().getViewSize().height - 120,

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