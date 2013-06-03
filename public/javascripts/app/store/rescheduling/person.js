Ext.define('app.store.rescheduling.person', {
	extend: 'Ext.data.Store',
	model: 'app.model.rescheduling.personModel', 
	proxy: {
		type: 'rest',
		url : '/rescheduling/get_person',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true

});