Ext.define('app.model.exclusivePoint.Buyer', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'buyer_id', type: 'int',    useNull: true },
		{name: 'type',     type: 'string'},
		{name: 'podr',     type: 'string'},
		{name: 'super',    type: 'string'},
		{name: 'tp',       type: 'string'},
		{name: 'name',     type: 'string'},
		{name: 'loadto',   type: 'string'},
		{name: 'super_id', type: 'int',    useNull: true},
		{name: 'tp_id',    type: 'int',    useNull: true},
	]
});