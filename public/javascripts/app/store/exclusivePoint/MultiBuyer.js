Ext.define('app.store.exclusivePoint.MultiBuyer', {
	extend: 'Ext.data.Store',
	
	itemId: 'multiBuyerStore',
	model: 'app.model.exclusivePoint.Buyer',
		
	proxy: {
		type: 'rest',
		url : '/exclusive_point/multi_buyer',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
	}
})