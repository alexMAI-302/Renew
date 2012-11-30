//хранилище отделений банка
Ext.define('app.store.AutoTransport.Income.IncType', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'memory'
	},
	data: [
		{id: 0, name: 'Безнал'},
		{id: 1, name: 'Нал'}
	]
});