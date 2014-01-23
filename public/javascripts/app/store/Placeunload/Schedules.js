Ext.define('app.store.Placeunload.Schedules', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/util_data/get_schedules',
		reader: {
			type: 'json'
		}
	}
});