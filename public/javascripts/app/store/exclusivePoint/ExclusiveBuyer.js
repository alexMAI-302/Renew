Ext.define('app.store.exclusivePoint.ExclusiveBuyer', {
	extend: 'Ext.data.Store',
	
	itemId: 'exclusiveBuyerStore',
	model: 'app.model.exclusivePoint.Buyer',
	
	proxy: {
		type: 'rest',
		url : '/exclusive_point/ask_buyers_by_coord',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
	}
})