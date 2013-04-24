Ext.define('app.store.empSchedule.dept', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel', 
	proxy: {
		type: 'rest',
		url : '/emp_schedule/get_dept',
		reader: {
			type: 'json'
		}
	}
});