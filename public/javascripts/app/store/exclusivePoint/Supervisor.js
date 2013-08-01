Ext.define('app.store.exclusivePoint.Supervisor', {
	extend: 'Ext.data.Store',
	
	itemId: 'buyer',
	model: 'app.model.exclusivePoint.Supervisor',
	
	proxy: {
		type: 'rest',
		url : '/exclusive_point/ask_super_multi',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
	}
})