Ext.define('app.model.ClothingSize.ClothingSizeModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type: 'int'},
	{name: 'shortened',   type: 'string'},
	{name: 'dept',   type: 'string'},
	{name: 'pos',   type: 'string'},
	{name: 'size_shoulders',   type: 'string'},
	{name: 'size_hips',   type: 'string'}
	]
});
