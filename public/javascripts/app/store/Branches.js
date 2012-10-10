//хранилище отделений банка
Ext.define('app.store.Branches', {
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