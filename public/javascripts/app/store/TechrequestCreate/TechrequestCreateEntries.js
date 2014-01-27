Ext.define('app.store.TechrequestCreate.TechrequestCreateEntries', {
	extend: 'Ext.data.Store',
	model: 'app.model.TechrequestCreate.TechrequestCreateEntryModel',
	proxy: {
		type: 'rest',
		url : '/techrequest_create/techrequest_get_terminals',
		reader: {
			type: 'json'
		}
	}
});