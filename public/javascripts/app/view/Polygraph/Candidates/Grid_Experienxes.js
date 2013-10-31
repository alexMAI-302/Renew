Ext.define('app.view.Polygraph.Candidates.Grid_Experienxes', {
    extend: 'app.view.Lib.Grid.Panel',


	alias: 'widget.candidates_grid_Experienxes',

	
	
	
	config:{
		suffix: 'Experienxes',
		store: 'Polygraph.Experienxes',
		disableDeleteColumn: true,
		disableSave: true,
		disableRefresh: true,

		columns : [
		
			{
				align: 'center',
				width : 450,
				header : 'Организация',
				dataIndex : 'organization',
				field: {
					xtype: 'textfield'
			}
			},
			{
				align: 'center',
				width : 450,
				header : 'должность',
				dataIndex : 'position',
				field: {
					xtype: 'textfield'
			}
			},
			{
				align: 'center',
				xtype: 'datecolumn',
				width: 80,
				header: 'Дата<br>устройства',
				dataIndex: 'ddateb',
				name: 'ddateb',
				format: 'd.m.Y',
				field: {
					xtype: 'datefield'
				}
			},
			{
				align: 'center',
				xtype: 'datecolumn',
				width: 80,
				header: 'Дата<br>увольнения',
				dataIndex: 'ddatee',
				name: 'ddatee',
				format: 'd.m.Y',
				field: {
					xtype: 'datefield'
				}
			}
			
		]
	}
});