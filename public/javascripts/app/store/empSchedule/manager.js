Ext.define('app.store.empSchedule.manager', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel', 
	proxy: {
		type: 'rest',
		url : '/emp_schedule/get_person',
		reader: {
			type: 'json'
		}
	}
});