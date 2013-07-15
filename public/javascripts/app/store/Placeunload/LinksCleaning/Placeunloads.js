Ext.define('app.store.Placeunload.LinksCleaning.Placeunloads', {
	extend: 'Ext.data.Store',
	model: 'app.model.Placeunload.linksCleaning.PlaceunloadModel',
	proxy: {
		type: 'rest',
		url : '/placeunload/links_cleaning/get_placeunloads',
		reader: {
			type: 'json'
		}
	}
});