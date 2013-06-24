Ext.define('app.view.brsComment.BrsComment' ,{
    extend: 'app.view.Lib.Grid.Panel',

	renderTo: 'brs_comment_js',
	height: 400,
	
	config: {
		suffix: 'BrsComment',
		disableDeleteColumn: true,
		disableRefresh: true,
		
		columns: [{
			dataIndex: 'id',
			text: 'Идентификатор',
			hidden: true,
			disabled: true
		}, {
			dataIndex: 'name',
			text: 'Название',
			width: 255,
			sortable: true,
			hideable: false,
			editor: {
				xtype: 'textfield',
				allowBlank: false
			}
		}]
	}
});
