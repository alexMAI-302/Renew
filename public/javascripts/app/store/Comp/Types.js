Ext.define('app.store.Comp.Types', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/comp/get_types',
		reader: {
			type: 'json'
		}
	}
});