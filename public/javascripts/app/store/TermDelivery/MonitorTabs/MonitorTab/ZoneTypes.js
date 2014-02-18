//хранилище типов зоны
Ext.define('app.store.TermDelivery.MonitorTabs.MonitorTab.ZoneTypes', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/term_delivery/monitor/get_zone_types',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true
});