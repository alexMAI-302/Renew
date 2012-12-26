Ext.define('app.store.Comp.Persons', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/comp/get_persons',
		reader: {
			type: 'json'
		}
	}
});