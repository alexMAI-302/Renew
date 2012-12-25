Ext.define('app.store.Comp.Terminals', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/comp/get_terminals',
		reader: {
			type: 'json'
		}
	}
});