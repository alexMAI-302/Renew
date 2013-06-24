Ext.define('app.model.gitSearch.SearchResult', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'repo', type: 'string'},
		{name: 'name', type: 'string'}
	],
	
	proxy: {
		type: 'rest',
		url : '/git_search/search',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
	},
});