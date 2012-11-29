Ext.define('app.view.UnactInfoAdmin.Container', {
    extend: 'Ext.grid.Panel',
	
	height: 600,
	
	id: 'actionsTable',
	title: 'Информационные материалы',
	renderTo: Ext.get('unact_info_js'),
	columns: [
		{
			header: 'Описание',
			dataIndex: 'name',
			field: {
				xtype: 'textfield'
			},
			width: 300
		},
		{
			header: 'Имя файла',
			dataIndex: 'path',
			field: {
				xtype: 'textfield'
			},
			width: 300
		},
		{
			header: 'Размер, Байт',
			dataIndex: 'size'
		},
		{
			id: 'viewFile',
			xtype:'actioncolumn',
			width:40,
			icon: '/images/view.png',
			handler: function(grid, rowIndex, colIndex){
				var r = grid.store.getAt(rowIndex),
					name=r.get("name"),
					path=r.get("path");
				window.open("/unact_info/pdf/"+path, name, "target: '_blank'");
				return true;
			}
		},
		{
			xtype:'actioncolumn',
			width:40,
			icon: '/images/upload.png'
		},
		{
			xtype:'actioncolumn',
			width:40,
			icon: '/ext/examples/shared/icons/fam/cross.gif',
			handler: function(grid, rowIndex, colIndex){
				var currentRecord=grid.store.getAt(rowIndex);
				
				grid.store.remove(currentRecord);
			}
		}
	],
	plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit: 1
	})],
	tbar: [
		{
			id: 'addFile',
			icon: '/ext/examples/shared/icons/fam/add.png',
		},
		{
			id: 'refresh',
			icon: '/ext/examples/shared/icons/fam/table_refresh.png',
		},
		{
			id: 'save',
			icon: '/images/save.png'
		}
	]
});