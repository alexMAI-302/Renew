Ext.define('app.view.AutoTransport.Income.ItemsGrid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.incGoodsGrid',
	
	config: {
		suffix: 'IncGoods',
	    disabled: true,
	    disableSave: true,
	    disableDeleteColumn: true,
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
					minValue: 0.0001
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
			}
		],
		plugins: [
			{
				ptype: 'cellediting',
				clicksToEdit: 1,
				listeners:{
					edit: function(editor, e){
						var r=e.record;
						r.set('sum', r.get('vol')*r.get('price'));
						e.grid.getView().refresh();
						return true;
					}
				}
			}
		],
		features: [{
			ftype: 'summary'
		}]
	}
});