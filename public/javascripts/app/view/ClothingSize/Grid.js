Ext.define('app.view.ClothingSize.Grid', {
    extend: 'Ext.tree.Panel',
	alias: 'widget.deptGrid',
	
	initComponent: function() {
		var suffix = 'Dept';
        Ext.apply(this, {
			id: suffix+'Table',
			rootVisible: false,
			useArrows: true,
			store: Ext.create('app.store.ClothingSize.Dept'),
			hideHeaders: true,
			title: 'Отделы',
			header: false,
			columns: [
				{
					width: 400,
					xtype: 'treecolumn',
					header: 'Наименование',
					dataIndex: 'name',
					editor: {
						xtype: 'textfield'
					}
				}
			]
			});
        
        this.callParent(arguments);
    }
});