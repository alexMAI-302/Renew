Ext.define('app.view.Polygraph.PersonAnswer', {
    extend: 'app.view.Lib.Grid.Panel',
	requires: [
		'app.view.Lib.Grid.column.ComboColumn'
	],


	alias: 'widget.polygraph_person_answer',

	
	
	
	config:{
		suffix: 'PersonAnswers',
		store: 'Polygraph.PersonAnswer',
		disableDeleteColumn: true,
		disableSave: true,
		disableRefresh: true,
		columns : [
			{
				align: 'center',
				width : 500,
				header : 'Вопрос',
				dataIndex : 'question_id',
				xtype: 'combocolumn',
				store: 'app.store.Polygraph.Person_questions'
			},
			{
				align: 'center',
				width : 500,
				header : 'Ответ',
				dataIndex : 'name',
				field: {
					xtype: 'textfield'
			}
			}
			
		]

		
	}
});