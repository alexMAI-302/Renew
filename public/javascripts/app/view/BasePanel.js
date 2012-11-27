Ext.define('app.view.BasePanel' ,{
	extend: 'Ext.grid.Panel',
	
	lbar: [{
		icon: '/ext/examples/shared/icons/fam/add.gif',
		itemId: 'add'
	}, {
		icon: '/ext/examples/shared/icons/fam/delete.gif',
		itemId: 'delete'
	}]
});