Ext.define('app.store.TechrequestCreate.RequestTypes', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/techrequest_create/techrequest_get_requesttypes',
		reader: {
			type: 'json'
		}
	}
});