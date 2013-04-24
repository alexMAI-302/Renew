Ext.define('app.store.empSchedule.empSchedule', {
	extend: 'Ext.data.Store',
	model: 'app.model.empSchedule.empScheduleModel',
	proxy: {
		type: 'rest',
		url : '/emp_schedule/emp_schedule',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});