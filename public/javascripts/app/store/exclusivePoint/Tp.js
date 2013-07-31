Ext.define('app.store.exclusivePoint.Tp', {
	extend: 'Ext.data.Store',
	
	itemId: 'buyer',
	model: 'app.model.exclusivePoint.Tp',
	
	proxy: {
		type: 'rest',
		url : '/exclusive_point/ask_tp_multi',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
	}
})