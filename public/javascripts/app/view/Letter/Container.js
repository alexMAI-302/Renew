Ext.define('app.view.Letter.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.letterPanel',
	
	requires: [
		'app.view.Letter.Filter',
		'app.view.Lib.Grid.Panel'
	],
	
	renderTo: 'letter_js',
	
	items:[
		{
			xtype: 'letterFilter'
		},
		{
			xtype: 'simpleGrid',
			suffix: 'Letter',
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
					header: 'Период',
					dataIndex: 'period',
					hidden: true,
					disabled: true
				},				
				{
					header: 'Условие',
					dataIndex: 'cterm',
					hidden: true,
					disabled: true
				},
				{
					width: 300,
					header: 'Размещение',
					dataIndex: 'cname',
				},
				{
					width: 250,
					header: 'Юр. лицо',
					dataIndex: 'name',
				},
				{
					header: 'Собран',
					xtype: 'checkcolumn',
					dataIndex: 'status',
					width: 70,
					disabled: true
				},
				{
					header: 'Выдавать',
					xtype: 'checkcolumn',
					dataIndex: 'issue',
					width: 70,
					stopSelection: false
				},
				{
					width: 300,
					header: 'Информация',
					dataIndex: 'info',
					field: {
					xtype: 'textfield'
					}
				},
				{
					header: 'Выдано',
					xtype: 'checkcolumn',
					dataIndex: 'issued',
					width: 70,
					stopSelection: false
				},
				{
					width: 300,
					header: 'Комментарий диспетчера',
					dataIndex: 'info_issued',
					field: {
					xtype: 'textfield'
					}
				}						
		
			]
		}
	]
});