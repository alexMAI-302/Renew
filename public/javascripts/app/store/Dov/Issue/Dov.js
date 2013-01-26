Ext.define('app.store.Dov.Issue.Dov', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel',
	proxy: {
		type: 'ajax',
		url : '/dov/get_dov_issue',
		reader: {
			type: 'json'
		}
	}
});