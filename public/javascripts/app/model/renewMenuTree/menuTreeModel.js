Ext.define('app.model.renewMenuTree.menuTreeModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'string', persist: false},
	{name: 'parent_id'	, type:'int'},
	{name: 'child_id'	, type:'int'},
	{name: 'is_new'		, type:'boolean', persist: false, defaultValue: false}]
});