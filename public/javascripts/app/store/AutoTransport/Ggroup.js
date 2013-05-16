Ext.define('app.store.AutoTransport.Ggroup', {
	extend: 'Ext.data.Store',
	model: 'app.model.AutoTransport.NomenclatureGroupModel',
	proxy: {
		type: 'ajax',
		url : '/auto_transport/get_flat_nomenclature_groups',
		reader: {
			type: 'json'
		}
	}
});