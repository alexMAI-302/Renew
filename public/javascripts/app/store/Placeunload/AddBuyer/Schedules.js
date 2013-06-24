Ext.define('app.store.Placeunload.AddBuyer.Schedules', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/placeunload/add_buyer/get_schedules',
		reader: {
			type: 'json'
		}
	}
});