Ext.define('app.view.BuyersRoute.Grid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.buyersRouteGrid',
	
	config: {
		suffix: 'BuyersRoutes',
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		disableSave: true,
		disableRefresh: true,
		title: 'Маршруты',
		columns: [
			{
				width: 170,
				header: 'Наименование',
				dataIndex: 'name'
			}
		]
	}
});