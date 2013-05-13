Ext.define('app.model.BuyersRoute.SiteModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type: 'int'},
	{name: 'name'		, type: 'string'},
	{name: 'latitude'	, type: 'float', useNull: true},
	{name: 'longitude'	, type: 'float', useNull: true}]
});
