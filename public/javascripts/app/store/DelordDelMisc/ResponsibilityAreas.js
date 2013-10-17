Ext.define('app.store.DelordDelMisc.ResponsibilityAreas', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/delord_del_misc/get_responsibility_areas',
		reader: {
			type: 'json'
		}
	}
});