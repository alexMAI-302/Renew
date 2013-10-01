Ext.define('app.store.EmpDutyroster.EmpDutytype', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/emp_dutyroster/get_emp_dutytype',
		reader: {
			type: 'json'
		}
	}
});