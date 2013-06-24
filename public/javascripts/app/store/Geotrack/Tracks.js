Ext.define('app.store.Geotrack.Tracks', {
	extend: 'Ext.data.Store',
	model: 'app.model.Geotrack.TrackModel',
	proxy: {
		type: 'rest',
		url : '/geotrack/get_tracks',
		reader: {
			type: 'json'
		}
	}
});