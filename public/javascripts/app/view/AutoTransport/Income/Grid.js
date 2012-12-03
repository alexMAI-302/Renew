//таблица
Ext.define('app.view.AutoTransport.Income.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.incomeGrid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'incomeTable',
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
					width: 70,
					header: 'Тип',
					dataIndex: 'type',
					field: {
						xtype: 'combo',
						displayField: 'name',
						valueField: 'id'
					}
				},
				{
					width: 70,
					xtype: 'numbercolumn',
					format: '0,00',
					header: 'Сумма',
					dataIndex: 'sum'
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
				pluginId: 'cellEditingIncome'
			})],
			tbar: [
				{
					id: 'addIncome',
					icon: '/ext/examples/shared/icons/fam/add.gif'
				}
			]
		});
        
        this.callParent(arguments);
    }
});
