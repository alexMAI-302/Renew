Ext.define('app.store.placeunloadSchedule.Salesmans', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/placeunload_schedule/get_salesman',
		reader: {
			type: 'json'
		}
	}
});
