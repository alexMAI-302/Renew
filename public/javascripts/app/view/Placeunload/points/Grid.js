Ext.define('app.view.Placeunload.points.Grid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.placeunloadsGrid',
	
	requires: [
		'app.view.Placeunload.points.UpdatePanel'
	],
	
	config: {
		store: 'Placeunload.points.Placeunloads',
		suffix: 'Placeunloads',
		disableAdd: true,
		disableDelete: true,
		disableDeleteColumn: true,
		disableRefresh: true,
		disableSave: true,
		selType: 'checkboxmodel',
		// bbar: {
			// xtype: 'changePlaceunloadPanel'
		// },
		columns: [
			{
				width: 200,
				header: 'Наименование<br/>Вывеска',
				xtype: 'templatecolumn',
				tpl: '{pname}<br/>{descr}'
			},
			{
				width: 350,
				header: 'Адрес<br/>Геокодированный адрес',
				xtype: 'templatecolumn',
				tpl: '{srcaddress}<br/>{fulladdress}',
				tdCls: 'x-wrap_cells'
			},
			{
				width: 70,
				header: 'Широта<br/>Долгота',
				xtype: 'templatecolumn',
				tpl: '{latitude}<br/>{longitude}',
				tdCls: 'x-wrap_cells'
			},
			{
				width: 110,
				header: 'Кат.<br/>Вр. разгр.',
				xtype: 'templatecolumn',
				tpl: '{placecategory_name}<br/>{unloading_name}',
				tdCls: 'x-wrap_cells'
			},
			{
				width: 65,
				header: 'Вр.дост.<br/>Вр.инк.',
				xtype: 'templatecolumn',
				tpl: '{delschedule_name}<br/>{incschedule_name}',
				tdCls: 'x-wrap_cells'
			},
			{
				width: 190,
				header: 'Маршрут<br/>Провер.',
				xtype: 'templatecolumn',
				tpl: '{buyers_route_name}<br/>{ischeck_name}',
				tdCls: 'x-wrap_cells'
			}
		]
	}
});