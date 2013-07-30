//хранилище периодов
Ext.define('app.store.Periods', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/util_data/get_period',
		reader: {
			type: 'json'
		}
	}
});