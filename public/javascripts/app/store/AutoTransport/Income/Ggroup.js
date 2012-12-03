//хранилище отделений банка
Ext.define('app.store.AutoTransport.Income.Ggroup', {
	extend: 'Ext.data.Store',
	model: 'app.model.AutoTransport.NomenclatureGroupModel',
	proxy: {
		type: 'ajax',
		url : '/auto_transport/nomenclature_groups',
		reader: {
			type: 'json'
		}
	}
});