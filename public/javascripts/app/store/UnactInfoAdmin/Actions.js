Ext.define('app.store.UnactInfoAdmin.Actions', {
	extend: 'Ext.data.Store',
	model: 'app.model.UnactInfoAdmin.ActionModel',
	proxy: {
		type: 'rest',
		url : '/unact_info/admin/actions',
		appendId: false,
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	},
	autoLoad: true
});