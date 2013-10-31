Ext.define('app.view.Polygraph.Candidates.Grid', {
    extend: 'app.view.Lib.Grid.Panel',

	requires: [
		'app.view.Lib.Grid.column.ComboColumn'
	],
	alias: 'widget.candidates_Grid',

	title: 'Новый сотрудник',
	
	
	
	config:{
		suffix: 'Candidates',
		store: 'Polygraph.Candidates',
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
				align: 'center',
				width : 150,
				header : 'Фамилия',
				dataIndex : 'lname',
				field: {
					xtype: 'textfield'
			}
			},
			{
				align: 'center',
				width : 100,
				header : 'Имя',
				dataIndex : 'fname',
				field: {
					xtype: 'textfield'
				}
			},
			{
				align: 'center',
				width : 100,
				header : 'Отчество',
				dataIndex : 'mname',
				field: {
					xtype: 'textfield'
				}
			},
			
			{
				align: 'center',
				width : 120,
				header : 'Должность',
				dataIndex : 'emp_pos_id',
				xtype: 'combocolumn',
				store: 'app.store.Polygraph.EmpPos'
			},
			{
				align: 'center',
				xtype: 'datecolumn',
				width: 80,
				header: 'Дата<br>рождения',
				dataIndex: 'birth_date',
				name: 'birth_date',
				format: 'd.m.Y',
				field: {
					xtype: 'datefield'
				}
			},
			{
				align: 'center',
				width : 70,
				header : 'Знак<br>зодиака',
				dataIndex : 'zodiac_id',
				xtype: 'combocolumn',
				store: 'app.store.Polygraph.Zodiacs'
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
				width : 250,
				header : 'Результат',
				dataIndex : 'result_id',
				xtype: 'combocolumn',
				store: 'app.store.Polygraph.CandidateResult'
			}
			
			
			

			
		]
	}
});