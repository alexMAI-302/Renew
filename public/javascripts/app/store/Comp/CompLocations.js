Ext.define('app.store.Comp.CompLocations', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/comp/get_comp_locations',
		reader: {
			type: 'json'
		}
	}
});