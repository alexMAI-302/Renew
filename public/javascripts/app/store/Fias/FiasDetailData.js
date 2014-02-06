Ext.define('app.store.Fias.FiasDetailData', {
	extend: 'Ext.data.Store',
	model: 'app.model.Fias.FiasDetailModel',
	proxy: {
		type: 'rest',
		url : '/fias/fias_detail',
		reader: {
			type: 'json'
		}
	}
});