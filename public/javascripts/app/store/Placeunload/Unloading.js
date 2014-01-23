Ext.define('app.store.Placeunload.Unloading', {
	extend: 'Ext.data.Store',

	model: 'app.model.valueModel',
	
	data: [
		{id: -1, name: '__Не определено'},
		{id: 15, name: '15 мин'},
		{id: 30, name: '30 мин'},
		{id: 45, name: '45 мин'},
		{id: 60, name: '1 час'},
		{id: 120, name: '2 час'},
		{id: 240, name: '4 час'}
	]
});