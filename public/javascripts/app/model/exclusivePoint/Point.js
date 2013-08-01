Ext.define('app.model.exclusivePoint.Point', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'latitude',  type: 'float'},
		{name: 'longitude', type: 'float'},
		{name: 'hasMulti',  type: 'boolean'}
	],
	
	proxy: {
		type: 'rest',
		url : '/exclusive_point/ask_exclusive_point',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
	},
});