Ext.define('app.store.TermDelivery.MakeAutoSetup.DayTypes', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	data:[
		{id: 1, name: "Рабочий"},
		{id: 2, name: "Суббота"},
		{id: 3, name: "Воскресение"}
	]
});
