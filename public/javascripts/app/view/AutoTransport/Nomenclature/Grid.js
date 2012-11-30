//таблица
Ext.define('app.view.AutoTransport.Nomenclature.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.nomenclatureGroupGrid',
    
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
					header: 'Наименование',
					dataIndex: 'name',
					field: {
						xtype: 'textfield'
					}
				},
				{
					width: 90,
					header: 'Тип',
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
