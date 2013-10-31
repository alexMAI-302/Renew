Ext.define('app.store.Polygraph.EmpPos', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_emp_pos',
		reader: {
			type: 'json'
		}
	}
});