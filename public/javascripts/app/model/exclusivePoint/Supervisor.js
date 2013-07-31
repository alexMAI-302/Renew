Ext.define('app.model.exclusivePoint.Supervisor', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'id',   type: 'int'},
		{name: 'name', type: 'string'},
		{name: 'podr', type: 'string'}
	],
});