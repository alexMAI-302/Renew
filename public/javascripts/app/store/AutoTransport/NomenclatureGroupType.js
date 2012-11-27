//хранилище отделений банка
Ext.define('app.store.AutoTransport.NomenclatureGroupType', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/auto_transport/get_nomenclature_group_types',
		reader: {
			type: 'json'
		}
	}
});