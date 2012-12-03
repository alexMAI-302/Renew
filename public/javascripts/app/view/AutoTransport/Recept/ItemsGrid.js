//проба
Ext.define('app.view.AutoTransport.Recept.ItemsGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.recGoodsGrid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'recGoodsTable',
			disabled: true,
			columns: [
				{
					width: 400,
					header: 'Группа',
					dataIndex: 'at_ggroup'
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
				pluginId: 'cellEditingRecGoods'
			})],
			features: [{
				ftype: 'summary'
			}],
			tbar: [
				{
					id: 'refreshRecGoods',
					icon: '/ext/examples/shared/icons/fam/table_refresh.png'
				},
				{
					id: 'addRecGoods',
					icon: '/ext/examples/shared/icons/fam/add.gif'
				}
			]
		});
        
        this.callParent(arguments);
    }
});
