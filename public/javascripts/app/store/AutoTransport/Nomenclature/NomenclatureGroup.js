Ext.define('app.store.AutoTransport.Nomenclature.NomenclatureGroup', {
	extend: 'Ext.data.TreeStore',
	model: 'app.model.valueModel',
	folderSort: true,
	storeId: 'NomenclatureGroupStore',
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