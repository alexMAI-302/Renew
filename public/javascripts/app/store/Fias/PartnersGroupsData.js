Ext.define('app.store.Fias.PartnersGroupsData', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
/*	remoteSort: true,
	sortOnLoad: true,
	sortRoot: 'sortcolumn',*/
	proxy: {
		type: 'rest',
		url : '/fias/partners_groups',
		reader: {
			type: 'json'
		}
	}
});