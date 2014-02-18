//хранилище терминалов
Ext.define('app.store.TermDelivery.MonitorTabs.MonitorTab.Terminals', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.MonitorTabs.MonitorTab.TerminalModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/monitor/get_terminals',
		reader: {
			type: 'json'
		}
	}
});