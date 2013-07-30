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
			height: 400,
			columns: [
				{xtype: 'rownumberer'},
				{
					header: 'Идентификатор',
					dataIndex: 'id',
					hidden: true,
					disabled: true
				},
				{
					header: 'Период',
					dataIndex: 'period',
					hidden: true,
					disabled: true
				},				{
					header: 'Условие',
					dataIndex: 'cterm',
					hidden: true,
					disabled: true
				},
				{
					header: 'Выдавать',
					xtype: 'checkcolumn',
					dataIndex: 'issue',
					id: 'issue',
					width: 70
				},
				{
					width: 300,
					header: 'Информация',
					dataIndex: 'info'
				}	
			]
		}
	]
});