Ext.define('app.store.Placeunload.LinksCleaning.Sites', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	autoLoad: true,
	proxy: {
		type: 'rest',
		url : '/util_data/get_sites',
		reader: {
			type: 'json'
		}
	}
});