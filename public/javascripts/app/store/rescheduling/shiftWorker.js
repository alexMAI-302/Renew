Ext.define('app.store.rescheduling.shiftWorker', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel', 
	proxy: {
		type: 'rest',
		url : '/rescheduling/get_shiftworker',
		reader: {
			type: 'json'
		}
	}
});