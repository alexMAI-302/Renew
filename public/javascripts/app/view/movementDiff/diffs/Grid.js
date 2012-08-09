//проба
Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn'
]);
Ext.define('app.view.movementDiff.diffs.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.diffsGrid',
	
	cls: 'diffs-grid',
    
    initComponent: function() {
        Ext.apply(this, {
			title: 'Расхождения межплощадочных перемещений',
			store: movementDiffStore,
			enableColumnHide: false,
			enableColumnMove: false,
			enableColumnResize: false,
			columns: [
				{
					header: 'Идентификатор',
					dataIndex: 'id',
					hidden: true
				},
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
			bbar: [
				{
					id: 'actionType',
					xtype: 'combobox',
					store: actionTypeStore,
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
					store: sitesSrcClearStore,
					queryMode: 'local',
					displayField: 'name',
					valueField: 'id',
					name: 'siteSrcAction',
					hidden: true
				},
				{
					id: 'siteDestAction',
					xtype: 'combobox',
					store: sitesDestClearStore,
					queryMode: 'local',
					displayField: 'name',
					valueField: 'id',
					name: 'siteDestAction',
					hidden: true
				},
				{
					id: 'ndocSOAction',
					xtype: 'combobox',
					store: ndocsSOClearStore,
					queryMode: 'local',
					displayField: 'id',
					valueField: 'id',
					name: 'ndocSOAction',
					hidden: true
				},
				{
					id: 'ndocSupAction',
					xtype: 'combobox',
					store: ndocsSupClearStore,
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
			],
			selModel: {
				selType: 'rowmodel'
			},
			viewConfig: {
				enableTextSelection: true
			}
		});
        
        this.callParent(arguments);
    }
});
