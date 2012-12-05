//таблица
Ext.define('app.view.AutoTransport.Recept.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.receptGrid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'receptTable',
			title: 'Приход',
			columns: [
				{
					width: 120,
					header: 'Дата',
					dataIndex: 'ddate',
					xtype: 'datecolumn',
					format: 'd.m.Y H:i',
					field: {
						xtype: 'datefield',
						format: 'd.m.Y H:i',
						value: Ext.Date.parse(Ext.Date.format(new Date(), 'd.m.Y H:i'), 'd.m.Y H:i')
					}
				},
				{
					width: 140,
					header: 'Машина',
					dataIndex: 'truck'
				},
				{
					xtype:'actioncolumn',
					width:20,
					icon: 'ext/examples/shared/icons/fam/cross.gif',
					handler: function(grid, rowIndex){
						grid.store.removeAt(rowIndex);
					}
				}
			],
			viewConfig: {
				enableTextSelection: true
			},
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1,
				pluginId: 'cellEditingRecept'
			})],
			tbar: [
				{
					id: 'addRecept',
					icon: '/ext/examples/shared/icons/fam/add.gif'
				}
			]
		});
        
        this.callParent(arguments);
    }
});
