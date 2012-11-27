//проба
Ext.define('app.view.AutoTransport.Nomenclature.ItemsGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.nomenclatureGrid',
	
	cls: 'terminals-grid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'nomenclatureTable',
			columns: [
				{
					width: 250,
					header: 'Наименование',
					dataIndex: 'name',
					field: {
						xtype: 'textfield'
					}
				},
				{
					width: 250,
					header: 'Единица измерения',
					dataIndex: 'measure'
				},
				{
					width: 250,
					header: 'Группа',
					dataIndex: 'at_ggroup'
				},
				{
					xtype:'actioncolumn',
					width:20,
					icon: 'ext/examples/shared/icons/fam/cross.gif'
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
					id: 'addNomenclature',
					icon: '/ext/examples/shared/icons/fam/add.gif'
				},
				{
					id: 'refreshNomenclature',
					icon: '/ext/examples/shared/icons/fam/table_refresh.png'
				}
			]
		});
        
        this.callParent(arguments);
    }
});
