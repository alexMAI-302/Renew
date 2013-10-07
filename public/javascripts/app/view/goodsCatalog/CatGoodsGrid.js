Ext.define('app.view.goodsCatalog.CatGoodsGrid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.catGoodsGrid',
	
	config: {
		store: 'goodsCatalog.CatGoods',
		suffix: 'CatGoods',
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		disableSave: true,
		title: 'Товары CAT',
		selModel: {
			mode: "MULTI"
		},
		selType: 'checkboxmodel',
		beforeButtons:[
			{
				id: 'CatGoodsName',
				xtype: 'textfield',
				fieldLabel: 'Наименование товара',
				enableKeyEvents: true,
				width: 400,
				labelWidth: 120
			}
		],
		afterButtons: [
			{
				id: 'CreateUnionOnSelectedCatGoods',
				xtype: 'button',
				icon: '/images/generalization_with_plus.png',
				tooltip: 'Создать товар каталога для выделения',
				disabled: true
			},
			{
				id: 'AddToUnionSelectedCatGoods',
				xtype: 'button',
				icon: '/images/generalization.png',
				tooltip: 'Перенести выделение в выбранный товар каталога',
				disabled: true
			}
		],
		columns: [
			{
				width: 300,
				header: 'Наименование',
				dataIndex: 'name'
			},
			{
				width: 400,
				header: 'Родительские товары каталога',
				dataIndex: 'union_goods_names'
			}
		]
	}
});