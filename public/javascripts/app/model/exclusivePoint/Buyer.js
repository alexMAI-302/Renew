Ext.define('app.model.exclusivePoint.Buyer', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'id',       type: 'int'},
		{name: 'buyer_id', type: 'int',    useNull: true},
		{name: 'type',     type: 'string',                   persist: false},
		{name: 'podr',     type: 'string',                   persist: false},
		{name: 'super',    type: 'string',                   persist: false},
		{name: 'tp',       type: 'string',                   persist: false},
		{name: 'name',     type: 'string',                   persist: false},
		{name: 'loadto',   type: 'string',                   persist: false},
		{name: 'super_id', type: 'int',    useNull: true,    persist: false},
		{name: 'tp_id',    type: 'int',    useNull: true,    persist: false},
	]
});