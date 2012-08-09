//локальное хранилище площадок
Ext.define('app.store.movementDiff.sitesStore', {
	extend: 'Ext.data.Store',

	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/util_data/get_sites',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true,
	listeners: {
		"load": function(store, records, successful, operation, options ){
			if(successful==true){
				sitesStore.insert(0, Ext.ModelManager.create({id: -1, name : 'ВСЕ'}, 'app.model.valueModel'));
			}
		}
	}
});