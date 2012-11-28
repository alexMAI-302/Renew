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
			header: false,
			columns: [
				{
					width: 200,
					name: 'Наименование',
					dataIndex: 'name',
					field: {
						xtype: 'textfield'
					}
				},
				{
					width: 90,
					name: 'Тип',
					dataIndex: 'at_ggtype',
					hidden: true
				}
			],
			width: 210,
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
					id: 'refreshNomenclatureGroup',
					icon: '/ext/examples/shared/icons/fam/table_refresh.png'
				},
				{
					id: 'addNomenclatureGroup',
					icon: '/ext/examples/shared/icons/fam/add.gif'
				},
				{
					id: 'deleteNomenclatureGroup',
					icon: '/ext/examples/shared/icons/fam/delete.gif',
					disabled: true
				}
			]
		});
        
        this.callParent(arguments);
    }
});
