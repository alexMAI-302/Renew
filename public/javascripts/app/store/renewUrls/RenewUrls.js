Ext.define('app.store.renewUrls.RenewUrls', {
	extend: 'Ext.data.Store',
	model: 'app.model.renewUrls.RenewUrlModel',
	proxy: {
		type: 'rest',
		url : '/renew_urls/renew_urls',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});