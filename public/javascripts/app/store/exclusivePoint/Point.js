Ext.define('app.store.exclusivePoint.Point', {
	extend: 'Ext.data.Store',
	
	itemId: 'point',
	model: 'app.model.exclusivePoint.Point',
	
	proxy: {
		type: 'rest',
		url : '/exclusive_point/ask_exclusive_point',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
	},
})