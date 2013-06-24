Ext.define('app.view.delordDelMisc.DelordDelMisc' ,{

    extend: 'app.view.Lib.Grid.Panel',

	renderTo: 'delord_del_misc_js',
	height: 400,
	
	config: {
		suffix: 'DelordDelMisc',
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

