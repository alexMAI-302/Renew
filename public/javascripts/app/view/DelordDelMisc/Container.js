Ext.define('app.view.DelordDelMisc.Container', {
    extend: 'app.view.Lib.Grid.Panel',

	requires: [
		'app.view.Lib.Grid.column.ComboColumn'
	],

	title: 'Комментарии к недовезенным заказам',
	
	renderTo: 'delord_del_misc_js',
	
	config:{
		suffix: 'DelordDelMisc',
		store: 'DelordDelMisc.DelordDelMisc',
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
				store: 'app.store.DelordDelMisc.ResponsibilityAreas'
			},
			{
				xtype: 'checkcolumn',
				width: 150,
				dataIndex: 'used_for_delivery',
				header: 'Исп. в доставке'
			}
			
			

			
		]
	}
});