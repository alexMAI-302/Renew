Ext.define('app.view.AutoTransport.Nomenclature.Grid', {
    extend: 'Ext.tree.Panel',
	alias: 'widget.nomenclatureGroupsGrid',
	
	initComponent: function() {
		var suffix = 'NomenclatureGroup';
        Ext.apply(this, {
			id: suffix+'Table',
			rootVisible: false,
			useArrows: true,
			store: Ext.create('app.store.AutoTransport.Nomenclature.NomenclatureGroup', {}),
			hideHeaders: true,
			title: 'Группы',
			header: false,
			tbar: [
				{
					id : 'add'+suffix,
					icon : '/ext/examples/shared/icons/fam/add.gif',
					tooltip: 'Добавить'
				},
				{
					id : 'delete'+suffix,
					icon : '/ext/examples/shared/icons/fam/delete.gif',
					disabled : true,
					tooltip: 'Удалить'
				}
			],
			columns: [
				{
					width: 200,
					xtype: 'treecolumn',
					header: 'Наименование',
					dataIndex: 'name',
					editor: {
						xtype: 'textfield'
					}
				}
			],
			plugins: [
				{
					ptype: 'cellediting',
					clicksToEdit : 2,
					pluginId: 'cellediting'+suffix
				}
			],
			viewConfig: {
				enableTextSelection: true,
				plugins: {
					ptype: 'treeviewdragdrop',
					pluginId: suffix+'DnD'
				}
			}
		});
        
        this.callParent(arguments);
    }
});