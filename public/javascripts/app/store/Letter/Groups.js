Ext.define('app.store.Letter.Groups', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/letter/get_groups',
		reader: {
			type: 'json'
		}
	}
});