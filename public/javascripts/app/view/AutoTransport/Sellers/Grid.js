//проба
Ext.define('app.view.AutoTransport.Sellers.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.sellersGrid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'sellersTable',
			columns: [
				{
					width: 150,
					header: 'Наименование',
					dataIndex: 'name',
					field: {
						xtype: 'textfield',
					}
				}
			],
			viewConfig: {
				enableTextSelection: true
			},
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1,
				pluginId: 'cellEditingSellers'
			})],
			tbar: [
				{
					id: 'refreshSellers',
					icon: '/ext/examples/shared/icons/fam/table_refresh.png'
				},
				{
					id: 'saveSellers',
					icon: '/images/save.png'
				},
				{
					id: 'addSeller',
					icon: '/ext/examples/shared/icons/fam/add.gif'
				},
				{
					id: 'deleteSeller',
					icon: '/ext/examples/shared/icons/fam/delete.gif',
					disabled: true
				}
			]
		});
        
        this.callParent(arguments);
    }
});
