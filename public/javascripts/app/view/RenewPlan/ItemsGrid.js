Ext.define('app.view.RenewPlan.ItemsGrid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.renewPlanGoodsPanel',
	
	requires: [
		'app.view.RenewPlan.FilterDetail'
	],
	
	config: {
		xtype: 'simpleGrid',
		store: 'RenewPlan.RenewPlanGoods',
		suffix: 'RenewPlanGoods',
		disableDeleteColumn: true,
		enableBuffering: true,
		height: 300,
		columnLines: true,
		beforeButtons: [{
			xtype: 'renewPlanFilterDetail'
		}],
		afterButtons: [
			{
				id: 'filterLggroupRenewPlanGoods',
				xtype: 'combobox',
				fieldLabel: 'Гр. план.',
				valueField: 'id',
				displayField: 'name',
				queryMode: 'local',
				allowNull: true,
				width: 250,
				labelWidth: 60,
				store: 'RenewPlan.Lggroups'
			},
			{
				xtype: 'checkbox',
				id: 'filterRenewPlanGoodsOnlyNotEmpty',
				fieldLabel: 'Только заполненные',
				labelWidth: 115
			},
			{
				xtype: 'textarea',
				id: 'XLSRenewPlanGoods',
				fieldLabel: 'XLS',
				style: {
					marginLeft: '40px'
				},
				labelWidth: 25,
				width: 75
			}
		],
		viewConfig: {
			enableTextSelection: true,
			getRowClass: function(record, rowIndex, rowParams, store){
				return record.get('row_class');
			}
		},
		columns: [
			{
				width: 300,
				header: 'Наименование',
				dataIndex: 'goods'
			},
			{
				width: 30,
				header: 'ABC',
				dataIndex: 'goods_abc',
				disabled: true
			},
			{
				width: 35,
				header: 'ABCD',
				dataIndex: 'abcd',
				disabled: true
			},
			{
				width: 35,
				header: 'Кат.<br/>прод.',
				dataIndex: 'sale_category'
			},
			{
				width: 30,
				header: 'Д',
				dataIndex: 'd',
				disabled: true
			},
			{
				xtype: 'numbercolumn',
				format: '0.00',
				width: 60,
				header: 'Поставка',
				dataIndex: 'supvol',
				disabled: true
			},
			{
				xtype: 'numbercolumn',
				format: '0.00',
				width: 55,
				header: 'Ост. ист.',
				dataIndex: 'remains_from',
				disabled: true
			},
			{
				xtype: 'numbercolumn',
				format: '0.00',
				width: 50,
				header: 'Резерв',
				dataIndex: 'resvolume',
				disabled: true
			},
			{
				xtype: 'numbercolumn',
				width: 60,
				header: 'Требуется',
				dataIndex: 'needvol',
				renderer: function(value, metaData, record){
					var src=record.get('fcast_src');
					if(record.get('peak')==1){
						metaData.tdCls += 'x-bold';
					}
					if(src!=null && src!=1){
						metaData.tdCls += ' x-red';
					}
					return (value)?Ext.Number.toFixed(value, 2):'';
				}
			},
			{
				xtype: 'numbercolumn',
				format: '0.00',
				width: 55,
				header: 'Ост.<br/>приемн.',
				dataIndex: 'remains_to',
				disabled: true
			},
			{
				width: 220,
				header: 'Статистика продаж',
				dataIndex: 'goodsstat',
				tdCls: 'x-wrap_cells',
				disabled: true
			},
			{
				width: 55,
				header: 'Кол-во',
				dataIndex: 'volume',
				disabled: true,
				tdCls: 'x-bold',
				renderer: function(value, metaData, record){
					metaData.tdCls += record.get('volume_class');
					return value;
				}
			},
			{
				width: 55,
				header: 'Факт',
				dataIndex: 'donevol',
				tdCls: 'x-bold',
				renderer: function(value, metaData, record){
					metaData.tdCls += record.get('volume_class');
					return value;
				}
			},
			{
				width: 35,
				header: 'Кор.<br/>в сл.',
				dataIndex: 'lminvol',
				disabled: true
			},
			{
				width: 45,
				header: 'Кор.<br/>на пал.',
				dataIndex: 'minvol',
				disabled: true
			},
			{
				xtype: 'numbercolumn',
				format: '0.00',
				width: 45,
				header: 'Масса',
				dataIndex: 'weight'
			},
			{
				xtype: 'numbercolumn',
				format: '0.00',
				width: 55,
				header: 'Объем',
				dataIndex: 'goods_volume'
			},
			{
				width: 50,
				header: 'Ост/др',
				dataIndex: 'has_remains'
			},
			{
				width: 45,
				header: 'Откл.',
				dataIndex: 'lackvol',
				disabled: true
			},
			{
				width: 50,
				header: 'Машина',
				dataIndex: 'trucknum'
			},
			{
				width: 50,
				header: 'Заявка',
				dataIndex: 'isxls',
				xtype: 'checkcolumn',
				disabled: true
			},
			{
				width: 60,
				header: 'Заказано',
				dataIndex: 'sordvol',
				disabled: true
			},
			{
				xtype: 'numbercolumn',
				format: '0.00',
				width: 60,
				header: 'Поддонов',
				dataIndex: 'pans',
				disabled: true
			}
		]
	}
});