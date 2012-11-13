//хранилище геоданных
Ext.define('app.store.SalesmanRoutes.GeoData', {
	extend: 'Ext.data.TreeStore',
	model: 'app.model.SalesmanRoutes.GeoDataModel',
	proxy: {
		type: 'ajax',
		url : '/salesman_routes/get_geo_data',
		reader: {
			type: 'json'
		}
	},
	folderSort: true
});
