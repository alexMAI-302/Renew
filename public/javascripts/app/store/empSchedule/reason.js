Ext.define('app.store.empSchedule.reason', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'memory'
	},
	data: [
		{id: 1, name: 'обмен смен'},
		{id: 2, name: 'отпуск'},
		{id: 3, name: 'изменение дня'}
	]
});