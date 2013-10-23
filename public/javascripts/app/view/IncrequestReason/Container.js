Ext.define('app.view.IncrequestReason.Container', {
    extend: 'app.view.Lib.Grid.Panel',

	requires: [
		'app.view.Lib.Grid.column.ComboColumn'
	],

	title: 'Причина невыполнения заявки на инкассацию',
	
	renderTo: 'increquest_reason_js',
	
	config:{
		suffix: 'IncrequestReason',
		store: 'IncrequestReason.IncrequestReason',
		disableDelete: true,
		columns : [
			{
				width : 200,
				header : 'Название',
				dataIndex : 'name',
				field: {
					xtype: 'textfield'
				}
			},
			{
				width : 150,
				header : 'Зона ответственности',
				dataIndex : 'responsibility_area_id',
				xtype: 'combocolumn',
				store: 'app.store.IncrequestReason.ResponsibilityAreas'
			},
			
			{
				xtype: 'checkcolumn',
				width: 150,
				dataIndex: 'used',
				header: 'Использовать'
			}

			
		]
	}
});