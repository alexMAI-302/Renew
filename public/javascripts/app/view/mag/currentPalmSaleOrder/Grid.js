//проба
Ext.define('app.view.mag.currentPalmSaleOrder.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.orderGrid',
	
	cls: 'currentPalmSaleOrder-grid',
	
	noRemains: 'Не хватает остатков',
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
					xtype:'actioncolumn',
					width:50,
					id: 'removePalmSaleItem',
					items: [
					{
						icon: 'ext/examples/shared/icons/fam/cross.gif'
					}]
				},
			],
			selModel: {
				selType: 'rowmodel'
			},
			plugins: [cellEditingPalmSale],
			height: 400,
			tbar: [
				{
					text: 'Сохранить',
					//handler : savePalmSale
				},
				{
					text: 'Сохранить и распечатать',
					handler : function() {
						//savePalmSale();
						
					}
				}
			],
			bbar: Ext.create('Ext.ux.StatusBar',
			{
				defaultText: this.ready,
				id: 'palmSaleItemStatusBar',
				text: this.ready,
				statusAlign: 'right',
				items:
				[
					{
						id: 'palmSaleItemReadCode',
						xtype: 'textfield',
						name: 'name',
						fieldLabel: 'Штрих-код',
						labelWitdh: 70,
						enableKeyEvents: true
					}
				]
			}),
			viewConfig: {
				enableTextSelection: true
			}

		});
        
        this.callParent(arguments);
    }
});
