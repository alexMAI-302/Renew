//хранилище отделений банка
Ext.define('app.store.AutoTransport.Nomenclature.NomenclatureGroupType', {
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