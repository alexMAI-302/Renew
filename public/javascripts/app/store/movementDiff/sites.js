//локальное хранилище площадок
Ext.define('app.store.movementDiff.sites', {
	extend: 'Ext.data.Store',

	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/util_data/get_sites',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true
});