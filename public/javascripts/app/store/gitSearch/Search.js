Ext.define('app.store.gitSearch.Search', {
	extend: 'Ext.data.Store',
	
	itemId: 'gitSearhStore',
	model:  'app.model.gitSearch.SearchResult',
			
	groupField: 'repo',
	groupDir: 'ASC'
});