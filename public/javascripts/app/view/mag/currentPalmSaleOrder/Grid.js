Ext.define('app.view.mag.currentPalmSaleOrder.Grid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.orderGrid',
	
	config: {
		suffix: 'CurrentPalmSale',
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		disableSave: true,
		disableRefresh: true,
		columns: [
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
				items: [
				{
					icon: '/ext/examples/shared/icons/fam/cross.gif'
				}]
			}
		],
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
		]
    }
});
