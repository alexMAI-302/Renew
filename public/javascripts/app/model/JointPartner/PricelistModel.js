Ext.define('app.model.JointPartner.PricelistModel', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id'			, type: 'int'},
		{name: 'name'		, type: 'string'},
		{name: 'pricelist',   type: 'int'},
		{name: 'podr',   		type: 'int'},
		{name: 'placeunload',   type: 'int'}
	]
});
