Ext.define('app.model.JointPartner.PricelistComboModel', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'psplink'			, type: 'int'},
		{name: 'id'	, type: 'int'},
		{name: 'name'		, type: 'string'},
		{name: 'plset',   		type: 'int'}
	],
	 idProperty:'psplink'
});
