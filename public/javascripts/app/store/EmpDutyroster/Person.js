Ext.define('app.store.EmpDutyroster.Person', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/emp_dutyroster/get_person',
		reader: {
			type: 'json'
		}
	}
});