Ext.define('app.view.TerminalKey.Container', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.terminalkeyPanel',

	requires : ['app.view.TerminalKey.Filter', 'app.view.Lib.Grid.Panel', 'app.view.Lib.Grid.column.ComboColumn'],
	renderTo: Ext.get('terminal_key_js'),
	width : '100%',
	layout : {
		type : 'border'
	},
	height : Ext.getBody().getViewSize().height - 120,

	items : [{
		xtype : 'terminalkeyFilter',
		region : 'north'
	}, {
		xtype : 'simpleGrid',
		suffix : 'TerminalKey',
		disableRefresh : true,
		disableDeleteColumn : true,
		disableDelete : true,
		disableAdd : false,
		region : 'center',
		columns : [{
			xtype : 'rownumberer',
			width : 30
		}, {
			header : 'Идентификатор',
			dataIndex : 'id',
			hidden : true
		}, 
		{
			width : 300,
			header : 'Наименование',
			dataIndex : 'name',
			field : {
				xtype : 'textfield'
			}
		}, 
		{
			width : 150,
			header : 'Тип',
			dataIndex : 'spv_id',
			xtype : 'combocolumn',
			store : 'app.store.TerminalKey.KeyTypeData'
		}, 
		{
			width : 150,
			header : 'Зона',
			dataIndex : 'zoneid',
			xtype : 'combocolumn',
			store : 'app.store.TerminalKey.PpsZoneData'
		}
		]
	},
	{
		xtype : 'simpleGrid',
		suffix : 'TerminalKeyLog',
		disableRefresh : true,
		disableDeleteColumn : true,
		disableDelete : true,
		disableAdd : true,
		disableSave : true,
		region : 'south',
		height : '30%', 
		split: true,
		columns : [{
			xtype : 'rownumberer',
			width : 30
		}, {
			header : 'Идентификатор',
			dataIndex : 'id',
			hidden : true
		}, 
		{
			width : 100,
			header : 'Операция',
			dataIndex : 'type_op',
		}, 
		{
			width : 200,
			header : 'Старое значение',
			dataIndex : 'old_strvalue',
		}, 
		{
			width : 200,
			header : 'Новое значение',
			dataIndex : 'new_strvalue',
		}, {
			width : 150,
			header : 'Дата',
			dataIndex : 'ts',
			renderer : function(value, metaData, record) {
				return (value) ? Ext.Date.format(new Date(value), 'd.m.Y H:i:s') : '';
			}
		}, 
		{
			width : 200,
			header : 'Пользователь',
			dataIndex : 'renew_user',
		}
		]
	}]
}); 