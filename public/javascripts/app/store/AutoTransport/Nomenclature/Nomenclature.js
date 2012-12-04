//хранилище отделений банка
Ext.define('app.store.AutoTransport.Nomenclature.Nomenclature', {
	extend: 'Ext.data.Store',
	model: 'app.model.AutoTransport.NomenclatureModel',
	proxy: {
		type: 'rest',
		url : '/auto_transport/nomenclature',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});