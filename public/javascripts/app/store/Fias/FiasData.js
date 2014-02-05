Ext.define('app.store.Fias.FiasData', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel',
	proxy: {
		type: 'rest',
		url : '/fias/fias',
		reader: {
			type: 'json'
		}
	}
});