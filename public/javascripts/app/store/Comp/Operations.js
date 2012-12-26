Ext.define('app.store.Comp.Operations', {
	extend: 'Ext.data.Store',
	model: 'app.model.Comp.OperationModel',
	proxy: {
		type: 'rest',
		url : '/comp/operations',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});