//хранилище субдилеров
Ext.define('app.store.Subdealers', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/util_data/get_subdealers',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true
});