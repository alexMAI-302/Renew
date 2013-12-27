Ext.define('app.view.Letter.Container', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.letterPanel',

	requires : ['app.view.Letter.Filter', 'app.view.Lib.Grid.Panel', 'app.view.Lib.Grid.column.ComboColumn'],
	renderTo : 'letter_js',

	width : '100%',
	layout : {
		type : 'border'
	},
	height : Ext.getBody().getViewSize().height - 120,

	items : [{
		xtype : 'letterFilter',
		region : 'north'
	}, {
		xtype : 'simpleGrid',
		suffix : 'Letter',
		disableRefresh : true,
		disableDeleteColumn : true,
		disableDelete : true,
		disableAdd : true,
		region : 'center',
		columns : [{
			xtype : 'rownumberer',
			width : 30
		}, {
			header : 'Идентификатор',
			dataIndex : 'id',
			hidden : true
		}, {
			header : 'Период',
			dataIndex : 'period',
			hidden : true,
			disabled : true
		}, {
			header : 'Условие',
			dataIndex : 'cterm',
			hidden : true,
			disabled : true
		}, {
			width : 300,
			header : 'Размещение',
			dataIndex : 'cname'
		}, {
			width : 250,
			header : 'Юр. лицо',
			dataIndex : 'name'
		}, {
			header : 'Собран',
			xtype : 'checkcolumn',
			dataIndex : 'status',
			width : 70,
			disabled : true
		}, {
			header : 'Выдавать',
			xtype : 'checkcolumn',
			dataIndex : 'issue',
			width : 70,
			stopSelection : false
		}, {
			width : 300,
			header : 'Информация',
			dataIndex : 'info',
			field : {
				xtype : 'textfield'
			}
		}, {
			header : 'Выдано',
			xtype : 'checkcolumn',
			dataIndex : 'issued',
			width : 70,
			stopSelection : false
		}, {
			width : 300,
			header : 'Комментарий диспетчера',
			dataIndex : 'info_issued',
			field : {
				xtype : 'textfield'
			}
		}, {
			width : 100,
			header : 'Дата выдал',
			dataIndex : 'ddate_issued',
			renderer : function(value, metaData, record) {
				return (value) ? Ext.Date.format(new Date(value), 'd.m.Y H:i') : '';
			}
		}, {
			width : 150,
			header : 'Кто выдал',
			dataIndex : 'user_issued'
		}, {
			width : 150,
			header : 'Менеджер',
			dataIndex : 'manager_id',
			xtype : 'combocolumn',
			queryMode : 'remote',
			store : 'app.store.Letter.Agents'
		}]
	}]
}); 