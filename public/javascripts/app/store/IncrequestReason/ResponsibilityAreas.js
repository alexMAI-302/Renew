Ext.define('app.store.IncrequestReason.ResponsibilityAreas', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/increquest_reason/get_responsibility_areas',
		reader: {
			type: 'json'
		}
	}
});