//хранилище супервайзеров
Ext.define('app.store.SalesmanRoutes.PalmUnits', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/salesman_routes/get_palm_units',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true
});