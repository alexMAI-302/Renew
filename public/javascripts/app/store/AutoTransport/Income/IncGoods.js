//хранилище отделений банка
Ext.define('app.store.AutoTransport.Income.IncGoods', {
	extend: 'Ext.data.Store',
	model: 'app.model.AutoTransport.GoodsModel',
	proxy: {
		type: 'rest',
		url : '/auto_transport/inc_goods',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});