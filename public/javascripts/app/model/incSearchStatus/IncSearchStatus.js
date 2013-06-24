Ext.define('app.model.incSearchStatus.IncSearchStatus', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'id',   type: 'int'},
		{name: 'name', type: 'string'}
	],
	
	proxy: {
		type: 'rest',
		url : '/inc_search_status/inc_search_status',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
		writer: {
			type: 'json'
		},
	},
});