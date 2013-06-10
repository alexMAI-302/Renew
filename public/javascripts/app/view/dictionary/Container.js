Ext.define('app.view.dictionary.Container', {
    extend: 'app.view.Lib.Grid.Panel',
    requires: 'app.view.Lib.Grid.column.ComboColumn',
	
	renderTo: 'dictionary_js',
	height: Ext.getBody().getViewSize().height - 120,
	
	config:
	{
		xtype: 'simpleGrid',
		suffix: 'Dictionary',
		store: 'dictionary.DictionaryEntries',
		beforeButtons: [
			{
				id: 'DictionaryFilter'+Ext.get('property1_name').getValue(),
				xtype: 'combobox',
				fieldLabel: Ext.get('property1_display_name').getValue(),
				store: 'dictionary.Properties1',
				displayField: 'name',
				valueField: 'id',
				allowBlank: false,
				queryMode: 'local',
				listeners: {
					beforequery: function(queryEvent, eOpts){
						queryEvent.forceAll=true;
						return true;
					}
				},
				width: 350,
				labelWidth: 150
			},
			{
				id: 'DictionaryFilter'+Ext.get('property2_name').getValue(),
				xtype: 'combobox',
				fieldLabel: Ext.get('property2_display_name').getValue(),
				store: 'dictionary.Properties2',
				displayField: 'name',
				valueField: 'id',
				allowBlank: false,
				queryMode: 'local',
				listeners: {
					beforequery: function(queryEvent, eOpts){
						queryEvent.forceAll=true;
						return true;
					}
				},
				width: 350,
				labelWidth: 150
			}
		],
		disableDeleteColumn: true,
		columns : [
			{
				width : 150,
				xtype: 'combocolumn',
				header : Ext.get('property1_display_name').getValue(),
				dataIndex : Ext.get('property1_name').getValue(),
				store: 'dictionary.Properties1'
			},
			{
				width : 200,
				xtype: 'combocolumn',
				header : Ext.get('property2_display_name').getValue(),
				dataIndex : Ext.get('property2_name').getValue(),
				store: 'dictionary.Properties2'
			}
		]
	}
});