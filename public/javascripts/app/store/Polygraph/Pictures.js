Ext.define('app.store.Polygraph.Pictures', {
	extend: 'Ext.data.Store',
	model: 'app.model.Polygraph.PictureModel',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_pictures',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});