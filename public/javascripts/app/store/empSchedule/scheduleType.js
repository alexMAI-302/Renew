Ext.define('app.store.empSchedule.scheduleType', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'memory'
	},
	data: [
		{id: 1, name: '5/2'},
		{id: 2, name: '2/2'}
	]
});