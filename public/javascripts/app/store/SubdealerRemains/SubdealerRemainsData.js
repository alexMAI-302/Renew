Ext.define('app.store.SubdealerRemains.SubdealerRemainsData', {
	extend: 'Ext.data.Store',
	model: 'app.model.SubdealerRemains.SubdealerRemainsModel',
	proxy: {
		type: 'rest',
		url : '/subdealer_remains/subdealer_remains',
		reader: {
			type: 'json'
		}
	}
});