//хранилище отделений банка
Ext.define('app.store.AutoTransport.Income.Goods', {
	extend: 'Ext.data.Store',
	model: 'app.model.AutoTransport.NomenclatureModel',

	proxy: {
		type: 'ajax',
		url : '/auto_transport/nomenclature',
		reader: {
			type: 'json'
		}
	}
});