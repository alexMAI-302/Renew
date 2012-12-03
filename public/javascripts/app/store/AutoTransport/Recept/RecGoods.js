//хранилище отделений банка
Ext.define('app.store.AutoTransport.Recept.RecGoods', {
	extend: 'Ext.data.Store',
	model: 'app.model.AutoTransport.GoodsModel',
	proxy: {
		type: 'rest',
		url : '/auto_transport/rec_goods',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});