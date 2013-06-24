//хранилище отделений банка
Ext.define('app.store.ppsZone.Branches', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/pps_zone/get_branches',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true
});