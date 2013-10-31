Ext.define('app.view.Polygraph.Candidates.Container', {
    extend: 'Ext.panel.Panel',
	requires: [
		'app.view.Polygraph.Candidates.Grid',
		'app.view.Polygraph.Candidates.Grid_Experienxes',
		'app.view.Polygraph.Candidates.Grid_Answers'
		
	
	],
	layout: {
		type: 'border'
	},
	
	title: 'Новый сотрудник',

        items: [
		{
			xtype: 'toolbar',
			region: 'north',
			items:[
				{
					id: 'refreshPolygraphCandidate',
					icon : '/ext/resources/themes/images/default/grid/refresh.gif',
					tooltip: 'Обновить'
				},
				{
					id: 'savePolygraphCandidate',
					icon: '/images/save.png',
					tooltip: 'Сохранить'
				}
			]
		},
            {
			xtype: 'candidates_Grid',
			region: 'center',
			split: true,
			flex: 1
			},
			
		{
			xtype: 'candidates_grid_Experienxes',
			region: 'south',
			flex: 1
		},
		{
			xtype: 'candidates_grid_Answers',
			region: 'south',
			flex: 1
		}
        ]
	

});