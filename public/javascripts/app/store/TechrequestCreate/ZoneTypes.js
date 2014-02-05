Ext.define('app.store.TechrequestCreate.ZoneTypes', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/techrequest_create/techrequest_get_zonetypes',
		reader: {
			type: 'json'
		}
	}
});