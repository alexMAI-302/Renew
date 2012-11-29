//проба
Ext.define('app.view.AutoTransport.Nomenclature.ItemsGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.nomenclatureGrid',
	
	cls: 'terminals-grid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'nomenclatureTable',
			disabled: true,
			columns: [
				{
					width: 400,
					header: 'Наименование',
					dataIndex: 'name',
					field: {
						xtype: 'textfield'
					}
				},
				{
					width: 110,
					header: 'Единица измерения',
					dataIndex: 'measure'
				},
				{
					width: 200,
					header: 'Группа',
					dataIndex: 'at_ggroup'
				},
				{
					width: 60,
					header: 'Остаток',
					dataIndex: 'cnt'
				}
			],
			viewConfig: {
				enableTextSelection: true
			},
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1,
				pluginId: 'cellEditingNomenclature'
			})],
			tbar: [
				{
					id: 'saveNomenclature',
					icon: '/images/save.png'
				},
				{
					id: 'refreshNomenclature',
					icon: '/ext/examples/shared/icons/fam/table_refresh.png'
				},
				{
					id: 'addNomenclature',
					icon: '/ext/examples/shared/icons/fam/add.gif'
				},
				{
					id: 'deleteNomenclature',
					icon: '/ext/examples/shared/icons/fam/delete.gif',
					disabled: true
				}
			]
		});
        
        this.callParent(arguments);
    }
});
