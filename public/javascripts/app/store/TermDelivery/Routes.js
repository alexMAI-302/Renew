//хранилище отделений банка
Ext.define('app.store.TermDelivery.Routes', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url : '/pps_zone/get_branches',
		reader: {
			type: 'json'
		}
	}
});
