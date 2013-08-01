Ext.define('app.model.exclusivePoint.BuyerCB', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'id',     type: 'int'},
		{name: 'name',   type: 'string'},
		{name: 'loadto', type: 'string'}
	]
});