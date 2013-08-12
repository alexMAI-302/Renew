Ext.define('app.view.BuyersRoute.Grid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.buyersRouteGrid',
	
	config: {
		suffix: 'BuyersRoutes',
		store: 'BuyersRoute.BuyersRoutes',
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
			},
			{
				width: 100,
				header: 'Площадка',
				dataIndex: 'site_name',
				renderer: function(v, metaData, r){
					metaData.style = "color: "+r.get('color')+";";
					return v;
				}
			}
		]
	}
});