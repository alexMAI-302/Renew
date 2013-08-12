Ext.define('app.model.exclusivePoint.Point', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'latitude',  type: 'float'},
		{name: 'longitude', type: 'float'},
		{name: 'hasMulti',  type: 'boolean'},
		{name: 'hint',      type: 'string'}
	]
});