Ext.define('app.store.Fias.PlaceunloadData', {
	extend: 'Ext.data.Store',
	model: 'app.model.Fias.PlaceunloadModel',
	proxy: {
		type: 'rest',
		url : '/fias/placeunload',
		reader: {
			type: 'json'
		}
	}
});