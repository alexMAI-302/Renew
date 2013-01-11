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
					width: 170,
					header: 'Группа',
					dataIndex: 'at_ggroup'
				},
				{
					width: 400,
					header: 'Наименование',
					dataIndex: 'at_goods'
				},
				{
					width: 80,
					header: 'Количество',
					dataIndex: 'vol',
					field: {
						xtype: 'numberfield',
						minValue: 1
					}
				},
				{
					width: 120,
					header: 'Единица измерения',
					dataIndex: 'measure'
				},
				{
					width: 80,
					header: 'Цена',
					dataIndex: 'price',
					field: {
						xtype: 'numberfield',
						minValue: 0
					}
				},
				{
					width: 80,
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
				pluginId: 'cellEditingIncomeGoods',
				listeners:{
					edit: function(editor, e){
						var r=e.record;
						r.set('sum', r.get('vol')*r.get('price'));
						e.grid.view.refresh();
						e.grid.view.saveScrollState();
						e.grid.view.refresh();
						e.grid.view.restoreScrollState();
						return true;
					}
				}
			})],
			features: [{
				ftype: 'summary'
			}],
			tbar: [
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
