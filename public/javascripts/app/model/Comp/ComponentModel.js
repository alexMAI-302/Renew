Ext.define('app.model.Comp.ComponentModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'int'},
	{name: 'serial'		, type:'string'},
	{name: 'type'		, type:'int',	useNull: true},
	{name: 'state'		, type:'string'},
	{name: 'descr'		, type:'string', persist: false}]
});
