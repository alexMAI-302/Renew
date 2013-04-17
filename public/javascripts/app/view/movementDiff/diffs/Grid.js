Ext.define('app.view.movementDiff.diffs.Grid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.diffsGrid',
	
    config: {
		suffix: 'movementDiff',
		title: 'Расхождения межплощадочных перемещений',
		
		enableColumnHide: false,
		enableColumnMove: false,
		enableColumnResize: false,
		
		height: 500,
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		disableRefresh: true,
		disableSave: true,
		columns: [
			{
				text: 'Отправитель',
				width: 85,
				dataIndex: 'site_src_id'
			},
			{
				header: 'Получатель',
				width: 85,
				dataIndex: 'site_dest_id'
			},
			{
				header: 'Номер заказа',
				dataIndex: 'ndoc_so',
				width: 80
			},
			{
				header: 'Дата заказа',
				dataIndex: 'ddate_so',
				width: 110,
				renderer: function(value, metaData, record){
					return (value)?Ext.Date.format(new Date(value), 'd.m.Y H:i'):'';
				}
			},
			{
				header: 'Номер поставки',
				dataIndex: 'ndoc_sup',
				width: 90
			},
			{
				header: 'Дата поставки',
				dataIndex: 'ddate_sup',
				width: 110,
				renderer: function(value, metaData, record){
					return (value)?Ext.Date.format(new Date(value), 'd.m.Y H:i'):'';
				}
			},
			{
				header: 'Наименование товара',
				dataIndex: 'goods_name',
				width: 400
			},
			{
				header: 'Заказ',
				columns: [
					{
						header: 'Количество',
						dataIndex: 'volume_so',
						width: 70
					},
					{
						header: 'Факт',
						dataIndex: 'donevol_so',
						width: 40
					}
				]
			},
			{
				header: 'Поставка',
				columns: [
					{
						header: 'Количество',
						dataIndex: 'volume_sup',
						width: 70
					},
					{
						header: 'Факт',
						dataIndex: 'donevol_sup',
						width: 40
					}
				]
			},
			{
				id: 'selectedDiffs',
				header: 'К<br/>списанию',
				width: 60,
				align: 'center',
				hidden: true,
				dataIndex: 'to_clear',
				xtype: 'checkcolumn'
			}
		],
		tbar: [
			{
				id: 'actionType',
				xtype: 'combobox',
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				name: 'actionType',
				fieldLabel: 'Списание остатков',
				labelWidth: 130,
				width: 350
			},
			{
				id: 'siteSrcAction',
				xtype: 'combobox',
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				name: 'siteSrcAction',
				hidden: true
			},
			{
				id: 'siteDestAction',
				xtype: 'combobox',
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				name: 'siteDestAction',
				hidden: true
			},
			{
				id: 'ndocSOAction',
				xtype: 'combobox',
				queryMode: 'local',
				displayField: 'id',
				valueField: 'id',
				name: 'ndocSOAction',
				hidden: true
			},
			{
				id: 'ndocSupAction',
				xtype: 'combobox',
				queryMode: 'local',
				displayField: 'id',
				valueField: 'id',
				name: 'ndocSupAction',
				hidden: true
			},
			{
				id		: 'clearDiff',
				xtype	: 'button',
				text    : 'Списать остатки',
				hidden	: true
			}
		]
	}
});
