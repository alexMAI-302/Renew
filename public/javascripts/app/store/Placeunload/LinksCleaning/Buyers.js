Ext.define('app.store.Placeunload.LinksCleaning.Buyers', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel',
	proxy: {
		type: 'rest',
		url : '/placeunload/links_cleaning/get_buyers',
		reader: {
			type: 'json'
		}
	}
});