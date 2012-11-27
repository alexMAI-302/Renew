//хранилище отделений банка
Ext.define('app.store.AutoTransport.NomenclatureGroup', {
	extend: 'Ext.data.Store',
	model: 'app.model.AutoTransport.NomenclatureGroupModel',
	groupField: 'at_ggtype',
	proxy: {
		type: 'rest',
		url : '/auto_transport/nomenclature_groups',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});