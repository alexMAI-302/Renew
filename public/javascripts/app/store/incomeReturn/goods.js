Ext.define('app.store.incomeReturn.goods', {
	extend: 'Ext.data.Store',
	model: 'app.model.incomeReturn.goodsModel',
	proxy: {
		type: 'ajax',
		url : '/income_return/get_goods',
		reader: {
			type: 'json'
		},
	}
});