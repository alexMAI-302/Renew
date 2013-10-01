Ext.define('app.store.EmpDutyroster.EmpDutyroster', {
	extend: 'Ext.data.Store',
	model: 'app.model.EmpDutyroster.UserModel',
	proxy: {
		type: 'rest',
		url : '/emp_dutyroster/emp_dutyroster',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});