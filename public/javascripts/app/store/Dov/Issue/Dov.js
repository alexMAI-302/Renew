Ext.define('app.store.Dov.Issue.Dov', {
	extend: 'Ext.data.Store',
	model: 'app.model.Dov.Issue.DovModel',
	proxy: {
		type: 'ajax',
		url : '/dov/get_dov_issue',
		reader: {
			type: 'json'
		}
	}
});