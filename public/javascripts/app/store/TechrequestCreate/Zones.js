Ext.define('app.store.TechrequestCreate.Zones', {
	extend: 'Ext.data.Store',
	model: 'app.model.TechrequestCreate.ZonesModel',
	proxy: {
		type: 'rest',
		url : '/techrequest_create/techrequest_get_zones',
		reader: {
			type: 'json'
		}
	}
});