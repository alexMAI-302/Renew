Ext.define('app.store.Letter.Managers', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/letter/get_managers',
		reader: {
			type: 'json'
		}
	}
});