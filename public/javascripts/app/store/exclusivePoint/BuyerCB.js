Ext.define('app.store.exclusivePoint.BuyerCB', {
	extend: 'Ext.data.Store',
	
	itemId: 'buyerCBStore',
	model: 'app.model.exclusivePoint.Buyer',
	
	proxy: {
		type: 'rest',
		url : '/exclusive_point/ask_buyer_multi_archiv',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
	}
})