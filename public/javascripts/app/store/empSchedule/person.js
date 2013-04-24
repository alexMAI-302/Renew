Ext.define('app.store.empSchedule.person', {
	extend: 'Ext.data.Store',
	model: 'app.model.empSchedule.personModel',
	proxy: {
		type: 'rest',
		url : '/emp_schedule/get_person',
		reader: {
			type: 'json'
		}
	}
});