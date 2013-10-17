Ext.define('app.store.IncrequestReason.IncrequestReason', {
	extend: 'Ext.data.Store',
	model: 'app.model.IncrequestReason.UserModel',
	proxy: {
		type: 'rest',
		url : '/increquest_reason/increquest_reason',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});