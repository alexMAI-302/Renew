Ext.define('app.store.BuyersRoute.Sites', {
	extend: 'Ext.data.Store',
	model: 'app.model.BuyersRoute.SiteModel',
	proxy: {
		type: 'rest',
		url : '/buyers_route/get_sites',
		reader: {
			type: 'json'
		}
	}
});