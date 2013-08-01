Ext.define('app.model.exclusivePoint.Tp', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'id',       type: 'int'},
		{name: 'name',     type: 'string'},
		{name: 'super_id', type: 'int'}
	],
});