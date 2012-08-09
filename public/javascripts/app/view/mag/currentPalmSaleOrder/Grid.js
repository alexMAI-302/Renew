//проба
Ext.define('app.view.mag.currentPalmSaleOrder.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.orderGrid',
	
	cls: 'currentPalmSaleOrder-grid',
	ready: 'Готово',
    
    initComponent: function() {
		var cellEditingPalmSale = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1,
			pluginId: 'cellEditingPalmSale'
		});
		
        Ext.apply(this, {
			id: 'currentPalmSaleTable',
			//store: getAppStoreMagCurrentPalmSaleItemsLocalStore(),
			columns: [
				// {
					// header: 'Идентификатор',
					// dataIndex: 'id',
					// hidden: true,
					// disabled: true
				// },
				{
					width: 200,
					header: 'Штрих-код',
					dataIndex: 'barcode'
				},
				{
					width: 70,
					header: '"Хороший"<br/>товар',
					align: 'center',
					dataIndex: 'is_good',
					xtype: 'checkcolumn',
					listeners: {
						beforecheckchange: function(checkColumn, rowIndex, checked, eOpts){
							return false;
						}
					}
				},
				{
					width: 250,
					header: 'Товар',
					dataIndex: 'name'
				},
				{
					width: 40,
					header: 'Цена',
					dataIndex: 'price'
				},
				{
					header: 'Количество',
					dataIndex: 'volume',
					width: 70,
					field: {
						xtype: 'numberfield',
						minValue: 1
					}
				},
				{
					header: 'Сумма',
					dataIndex: 'cost',
					width: 70,
					summaryType: 'sum'
				},
				{
					xtype:'actioncolumn',
					width:20,
					id: 'removePalmSaleItem',
					items: [
					{
						icon: 'ext/examples/shared/icons/fam/cross.gif'
					}]
				}
			],
			selModel: {
				selType: 'rowmodel'
			},
			plugins: [cellEditingPalmSale],
			features: [{
				ftype: 'summary'
			}],
			height: 400,
			tbar: [
				{
					text: 'Сохранить',
					id: 'saveCurrentPalmSale'
				},
				{
					text: 'Сохранить и распечатать',
					id: 'savePrintCurrentPalmSale'
				}
			],
			bbar: [
				{
					id: 'palmSaleItemReadCode',
					xtype: 'textfield',
					name: 'name',
					fieldLabel: 'Штрих-код',
					labelWitdh: 70,
					enableKeyEvents: true
				},
				{
					id: 'errorField',
					xtype: 'tbtext',
					text: 'Не хватает остатков или товар не найден',
					hidden: true,
					style: {
						color: 'red'
					}
				}
			],
			viewConfig: {
				enableTextSelection: true
			}

		});
        
        this.callParent(arguments);
    }
});
