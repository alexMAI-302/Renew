Ext.define('app.store.Polygraph.MaritalStatus', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'memory'
	},
		data: [
		{id: 1, name: 'холост'},
		{id: 2, name: 'замужем/женат'}
	]
});

