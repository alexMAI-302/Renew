Ext.define('app.model.BuyersRoute.PlaceunloadModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type: 'int'},
	{name: 'latitude'	, type: 'float', useNull: true},
	{name: 'longitude'	, type: 'float', useNull: true}]
});
