Ext.define('app.store.calcBp.Bp', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/bprog/get_bp',
		reader: {
			type: 'json'
		},
	}
});