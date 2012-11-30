//проба
Ext.define('app.view.AutoTransport.Income.ItemsGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.incGoodsGrid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'incGoodsTable',
			disabled: true,
			columns: [
				{
					width: 400,
					header: 'Группа',
					dataIndex: 'ag_gtype'
				},
				{
					width: 110,
					header: 'Наименование',
					dataIndex: 'at_goods'
				},
				{
					width: 200,
					header: 'Количество',
					dataIndex: 'vol',
					field: {
						xtype: 'numberfield',
						minValue: 1
					}
				},
				{
					width: 200,
					header: 'Единица измерения',
					dataIndex: 'measure'
				},
				{
					width: 200,
					header: 'Цена',
					dataIndex: 'price'
				},
				{
					width: 60,
					header: 'Сумма',
					dataIndex: 'sum',
					summaryType: 'sum'
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
				pluginId: 'cellEditingIncomeGoods'
			})],
			features: [{
				ftype: 'summary'
			}],
			tbar: [
				{
					id: 'saveIncGoods',
					icon: '/images/save.png'
				},
				{
					id: 'refreshIncGoods',
					icon: '/ext/examples/shared/icons/fam/table_refresh.png'
				},
				{
					id: 'addIncGoods',
					icon: '/ext/examples/shared/icons/fam/add.gif'
				}
			]
		});
        
        this.callParent(arguments);
    }
});
