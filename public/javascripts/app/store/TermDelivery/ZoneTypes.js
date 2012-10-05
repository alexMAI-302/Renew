//хранилище типов зоны
Ext.define('app.store.TermDelivery.ZoneTypes', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/pps_zone/get_zone_types',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true
});