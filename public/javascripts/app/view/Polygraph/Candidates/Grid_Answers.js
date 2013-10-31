Ext.define('app.view.Polygraph.Candidates.Grid_Answers', {
    extend: 'app.view.Lib.Grid.Panel',
	requires: [
		'app.view.Lib.Grid.column.ComboColumn'
	],


	alias: 'widget.candidates_grid_Answers',

	
	
	
	config:{
		suffix: 'Answers',
		store: 'Polygraph.CandidateAnswers',
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
				store: 'app.store.Polygraph.Candidate_questions'
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