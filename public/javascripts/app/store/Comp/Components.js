Ext.define('app.store.Comp.Components', {
	extend: 'Ext.data.Store',
	model: 'app.model.Comp.ComponentModel',
	proxy: {
		type: 'rest',
		url : '/comp/components',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});