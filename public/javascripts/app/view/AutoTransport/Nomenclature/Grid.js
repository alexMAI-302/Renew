//таблица
Ext.define('app.view.AutoTransport.Nomenclature.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.nomenclatureGroupGrid',
	
	cls: 'routes-grid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'nomenclatureGroupsTable',
			features: [
				{
					id: 'nomenclatureGroupsFeature',
					ftype:'grouping',
					groupHeaderTpl: '{name}'
				}
			],
			title: 'Группы',
			columns: [
				{
					xtype:'actioncolumn',
					width:20,
					icon: 'ext/examples/shared/icons/fam/cross.gif'
				},
				{
					width: 160,
					dataIndex: 'name',
					field: {
						xtype: 'textfield'
					}
				},
				{
					width: 90,
					dataIndex: 'at_ggtype'
				}
			],
			width: 280,
			viewConfig: {
				enableTextSelection: true
			},
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1,
				pluginId: 'cellEditingNomenclatureGroup'
			})],
			tbar: [
				{
					id: 'saveNomenclatureGroup',
					icon: '/images/save.png'
				},
				{
					id: 'addNomenclatureGroup',
					icon: '/ext/examples/shared/icons/fam/add.gif'
				},
				{
					id: 'refreshNomenclatureGroup',
					icon: '/ext/examples/shared/icons/fam/table_refresh.png'
				}
			]
		});
        
        this.callParent(arguments);
    }
});
