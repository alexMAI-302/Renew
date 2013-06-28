Ext.define('app.store.renewUrls.RenewUrlTypes', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/renew_urls/get_renew_url_types',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});