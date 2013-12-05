Ext.define('app.view.SubdealerRemains.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.subdealerremainsPanel',
	
	requires: [
		'app.view.Lib.DateIntervalFilter',
		'app.view.Lib.Grid.Panel'
	],
	
//	height: Ext.getBody().getViewSize().height - 120,
	
	renderTo: Ext.get('subdealer_remains_js'),
	
	/*layout: {
		type: 'border'
	},*/
	items:[
		{
			xtype: 'dateIntervalFilter',
			suffix: 'SubdealerRemains',
			shiftBegin: -7
		},
		{
			xtype: 'simpleGrid',
			suffix: 'SubdealerRemains',
			disableRefresh: true,
			region: 'center',
			disableDeleteColumn: true,
			disableDelete: true,
			disableAdd: true,
			region: 'center',
			width: '100%',
			columns: [
				{xtype: 'rownumberer',
					width: 30},
				{
					header: 'Идентификатор',
					dataIndex: 'id',
					hidden: true
				},
				{
					width: 100,
					header: 'Дата',
					dataIndex: 'ddate',
					renderer: function(value, metaData, record){
					return (value)?Ext.Date.format(new Date(value), 'd.m.Y'):'';
				}
				},
				{
					width: 100,
					header: 'Дата ответа',
					dataIndex: 'answer_ddate',
					renderer: function(value, metaData, record){
					return (value)?Ext.Date.format(new Date(value), 'd.m.Y H:i'):'';
				}
				},
				{
					header: 'Агент',
					dataIndex: 'name',
					width: 300
				},
				{
					header: 'Остаток',
					dataIndex: 'summ',
					width: 100,
					field: {
						xtype: 'numberfield'
						}
				}					
		
			]
		}
	]
});