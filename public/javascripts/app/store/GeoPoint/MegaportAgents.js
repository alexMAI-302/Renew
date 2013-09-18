//хранилище агентов Мегапорта
Ext.define('app.store.GeoPoint.MegaportAgents', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url : '/geo_point/get_megaport_agents',
		reader: {
			type: 'json'
		}
	}
});