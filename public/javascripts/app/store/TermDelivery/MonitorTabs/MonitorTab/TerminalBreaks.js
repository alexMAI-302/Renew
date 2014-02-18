//хранилище поломок терминала
Ext.define('app.store.TermDelivery.MonitorTabs.MonitorTab.TerminalBreaks', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/monitor/get_terminal_breaks',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true
});