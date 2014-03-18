Ext.define('app.view.Polygraph.Person.Grid', {
    extend: 'app.view.Lib.Grid.Panel',

	requires: [
		'app.view.Lib.Grid.column.ComboColumn'
	],
	alias: 'widget.polygraph_person_Grid',


	
	
	config:{
		suffix: 'PolygraphPerson',
		store: 'Polygraph.PolygraphPerson',
		disableDeleteColumn: true,
		disableSave: true,
		disableRefresh: true,

		columns : [
		{
				align: 'center',
				xtype: 'datecolumn',
				width: 80,
				header: 'Дата<br>заполнения',
				dataIndex: 'ddate',
				name: 'ddate',
				format: 'd.m.Y',
				field: {
					xtype: 'datefield'
				}
			},
		
		{
				width : 200,
				header : 'Сотрудник',
				dataIndex : 'person',
				xtype: 'combocolumn',
				store: 'app.store.Polygraph.Person'

				
		
			},
			{
				align: 'center',
				width : 100,
				header : 'Сем. пол.',
				dataIndex : 'marital_status',
				xtype: 'combocolumn',
				store: 'app.store.Polygraph.MaritalStatus'
			},
			{
				align: 'center',
				width : 60,
				header : 'Детей',
				dataIndex : 'children_count',
				field : {xtype: 'numberfield'}
			},
			{
				align: 'center',
				width : 300,
				header : 'Инфо',
				dataIndex : 'info',
				field: {
					xtype: 'textfield'
				}
			},
				{
				width : 300,
				header : 'Результат',
				dataIndex : 'result_id',
				xtype: 'combocolumn',
				store: 'app.store.Polygraph.PersonResult'
			}
			

			
			
			
			

			
		]
	}
});