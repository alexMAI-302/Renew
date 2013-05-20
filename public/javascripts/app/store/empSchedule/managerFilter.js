Ext.define('app.store.empSchedule.managerFilter', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel', 
	proxy: {
		type: 'rest',
		url : '/emp_schedule/get_manager',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true
});