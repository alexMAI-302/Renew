Ext.define('app.view.Polygraph.Person.Container', {
    extend: 'Ext.panel.Panel',
	requires: [
		'app.view.Polygraph.Person.Grid',
		'app.view.Polygraph.Person.PersonAnswer',
		'app.view.Polygraph.Person.PersonFoto'
		
		
	],	

	layout: {
		type: 'border'
	},
	
	title: 'Сотрудник компании',
	items: [
		{
			xtype: 'toolbar',
			region: 'north',
			items:[
				{
					id: 'refreshPolygraphPerson',
					icon : '/ext/resources/themes/images/default/grid/refresh.gif',
					tooltip: 'Обновить'
				},
				{
					id: 'savePolygraphPerson',
					icon: '/images/save.png',
					tooltip: 'Сохранить'
				},
				{
					xtype	: 'button',
					text    : 'Загрузить фото',
					id		: 'PolygraphPersonLoadFoto',
					rowspan	: 2
				},
			]
		},
            {
			xtype: 'polygraph_person_Grid',
			region: 'center',
			 split:true             // установка возможности изменения размеров области.
			},
			{
			xtype: 'polygraph_person_answer',
			region: 'south',
			height: 200,
			 split:true             // установка возможности изменения размеров области.
			},
			
			{
			xtype: 'polygraph_person_foto',
			region: 'east',

			width: 200,
			 split:true,             // установка возможности изменения размеров области.
			 collapsible: true      // указываем что область может быть схлопнута
			}
			]
			
			


        
	

});