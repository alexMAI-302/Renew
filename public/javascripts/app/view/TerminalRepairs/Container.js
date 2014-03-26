Ext.define('app.view.TerminalRepairs.Container', {
    extend: 'app.view.Lib.Grid.Panel',
	requires: [
		'app.view.Lib.Grid.column.ComboColumn'
	],
	title: 'Виды ремонта',
	
	renderTo: 'terminal_repairs_js',
	height: Ext.getBody().getViewSize().height - 150,
	
	config:{
		suffix: 'TerminalRepairs',
		store: 'TerminalRepairs.TerminalRepairs',
		disableDelete: true,
		columns : [
			{
				width : 300,
				header : 'Наименование',
				dataIndex : 'repair_name',
				field: {
					xtype: 'textfield'
				}
			}
			,
			{
			    xtype: 'checkcolumn',
				width : 100,
				header : 'Техник',
				dataIndex : 'is_tech'
				
			},
			{
				xtype: 'checkcolumn',
				width : 100,
				header : 'Инкассатор',
				dataIndex : 'is_inc'
				
			},
			{
				xtype: 'checkcolumn',
				width : 100,
				header : 'Инженер',
				dataIndex : 'is_eng'
				
			}

			
	]
	}
});
